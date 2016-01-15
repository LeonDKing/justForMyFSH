/**
 * 所有异步请求的入口
 * 这里覆盖了jquery的ajax方法！！！！
 *
 * #扩展的潜规则
 * - 如果后台响应状态码正常，然后响应内容的success字段为false，你配置的error方法会调用，并且textStatus为'bussinessfail'
 * 所以你在用ajax的时候集中关注业务上 成功 或 失败 的后续行为
 * 
 * #扩展的自定义参数
 * ## autoMsg: true, 拦截到错误信息时是否自动弹出后台响应的msg字段的内容
 * ## successMsg: 如果后台响应表明操作成功了，那么自动弹出toast信息框
 * ## block: 异步请求发起前蒙住页面或者指定元素，当异步响应结束后，隐藏对应的蒙板
 *     - 用法1 
 *         设置true，然后直接整个页面蒙住显示默认的描述，例如“正在加载中”
 *     
 *     - 用法2
 *         //msg表示蒙板显示的内容, target表示要蒙哪个元素，默认是document.body 
 *         Opf.ajax(block: {msg: '正在删除', target: dom})  
 *  
 */
define(['jquery', 'bootbox', "i18n!nls/base" ], 
	function ( $, Bootbox, Lang ) {

    _ajax = $.ajax;
    
    var defaults = {
        //contentType: 'application/json',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: 'json'
    };

    //success callback
    var successChain = {
        pre: function (options, data,  textStatus, jqXHR) { 
            if(_.isString(data)) {
                try{
                    data = JSON.parse(data);
                }catch(e){}
            }

            //处理session超时或者未登录
            if(data && (data.timeOut || data.notlogin)) {
				Opf.alert( Lang["sesstionTimeout"], function() {
					window.location = "login";
				});
            	setTimeout( function() {
            		window.location = "login";
            	}, 5000);
                return false;
            }

            if(data && data.nopermission === true) {
                Opf.alert({
                    title: Lang[ "operaFailure" ], 
                    message: Lang[ "noRights" ]
                });
            }

            //业务请求成功
            if(data && data.success !== false){
                //如果配置了成功需要弹出的信息
                if(options.successMsg) {
                    Opf.Toast.success(options.successMsg);
                }
            }

            //如果业务请求失败
            if(data && data.success === false) {
                /*if(data.msg && options.autoMsg !== false) {
                    Opf.alert({ title: Lang[ "operaFailure" ], message: data.msg });
                }
                if(options.ignoreBsError !== true) {
                    //error Type: Function( jqXHR jqXHR, String textStatus, String errorThrown )
                    options.error && options.error(jqXHR, 'bussinessfail', Lang[ "operaFailure" ]);
                    return false;              
                }*/
            }

            return true;
        },
        post: function (options, data,  textStatus, jqXHR) { }
    };

    var completeChain = {
        pre: function (options, textStatus, jqXHR) {
            if(options.block) {
                // setupUnBlock(block);
            }
            return true;
        },
        post: function (options, textStatus, jqXHR) {}
    };

    var ajaxStopFnQueue = [];
    $(document).ajaxStop(function () {
        _.each(ajaxStopFnQueue,function(fn){fn&&fn();});
        ajaxStopFnQueue = [];
    });

    function setupUnBlock (block) {
        var fn;
        if(!block) return null;

        if (block.target) {
            fn = function () {
                (block.target ? $(block.target) : $).unblockUI();
            };
        }else {
            fn = function () { $.unblockUI(); };
        }
        ajaxStopFnQueue.push(fn);
    }

    function setupBlock (options) {
        var block = options.block;
        if(!block) return;
        if(block === true) {
            $.blockUI(block);            
        }else {
            (block.target ? $(block.target) : $).blockUI(block);
        }
    }

    function jsonEncode (data) {
        if($.isPlainObject(data) || $.isArray(data)) {
            return JSON.stringify(data);
        }
        else if (_.isString(data)) {
            return data;
        }else {
            return null;
        }
    }

    var Ajax = {

        request: function (url, argOptions) {

            //抄jquery，防止其他插件用了ajax方法第一个参数是url
            if ( typeof url === "object" ) {
                argOptions = url;
                url = undefined;
            }

            var options = $.extend(true, {}, defaults, argOptions);

            //如果配置了jsonData，则拷贝到jquery的data配置
            if(options.jsonData) {
                options.data = jsonEncode(_.result(options, 'jsonData'));
            }else {
                options.data = _.result(options, 'data');
            }

            var success = options.success;
            var complete = options.complete; 
            
            options.success = function( data,  textStatus, jqXHR ){
                if(successChain.pre(options, data,  textStatus, jqXHR)){
                    success && success.apply(null, arguments);
                    successChain.post(options, data,  textStatus, jqXHR);
                }
            };

            options.complete = function(jqXHR, textStatus){
                if(completeChain.pre(options, textStatus, jqXHR)){
                    complete && complete.apply(null, arguments);
                    completeChain.post(options, textStatus, jqXHR);
                }
            };
            
            // setupBlock(options);

            var ajaxDeferr = _ajax(url, options);

            return ajaxDeferr;
        }

    };

    $.ajax = Ajax.request;


    return Ajax;

});