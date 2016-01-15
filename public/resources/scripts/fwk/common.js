/**
 * Created by acer on 2015/3/19.
 */

define( [ 'jquery', 'bootstrap' ], function ( $ ) {
    wetherDevelopement = false;

    var allConstant = JSON.parse( localStorage.getItem( 'constant' ) ) ? JSON.parse( localStorage.getItem( 'constant' ) ) : '',
        SKUListTranslate = JSON.parse( localStorage.getItem('SKUList') ) /*== null ? {} : JSON.parse( localStorage.getItem('SKUList') )*/ || [],
        userInfo;


    //jquery textarea自适应高度
    $.fn.autoHeight = function(){

        function autoHeight( elem ){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }

        this.each(function(){
            autoHeight( this );
            $(this).on( 'keyup input', function(){
                autoHeight(this);
            });
        });

    }

    $('textarea').autoHeight();

    //$( document ).ready( function(){
    //
    //    location.pathname.indexOf('login.html') > -1 ? null : commonFunc.isLoginFunc()
    //    //$('#side-menu li:eq(5),#side-menu li:eq(7)').remove()
    //
    //    commonFunc.justShowAndDisabledFunc()
    //
    //    //插入ICON
    //    var icon = document.createElement('link')
    //    icon.href = 'img/skyroam_favicon_128.png'
    //    icon.rel = 'icon'
    //    document.head.insertBefore( icon, null )
    //
    //    //插入MD5
    //    var MD5 = document.createElement('script')
    //    MD5.src = 'js/jQuery.md5.js'
    //    document.head.insertBefore( MD5, null )
    //
    //    $('.modal').each(function(){
    //        $(this).attr( 'data-backdrop', 'static' )
    //    })
    //
    //    commonFunc.dateTimeBind()
    //    //if(loginUserName){
    //    //    userInfo=json_decode(cookie.get('userInfo'+loginUserName))
    //    //    if(userInfo==null||userInfo==''||userInfo==undefined){
    //    //        alert('请先登陆！')
    //    //        location.href='../loginIndex.html'
    //    //    }
    //    $('#loginAccountSetting').bind( 'click', function(){
    //        commonPasswordFunc()
    //    })
    //    $('#page-wrapper nav:eq(0) li:eq(1)').bind( 'click', function(){
    //        myConfirm( '是否退出登录？', function(){
    //            localStorage.clear()
    //            location.href = 'login.html'
    //        },'')
    //    })
    //    //    $('#side-menu li:not(".nav-header")').each(function(){
    //    //        var self=this
    //    //        if($(self).find('a').attr('href')==''||$(self).find('a').attr('href')=='#'){
    //    //        }
    //    //        else{
    //    //            $(self).find('a').attr('href',$(self).find('a').attr('href')+'?username='+loginUserName)
    //    //        }
    //    //    })
    //    //}
    //    //else{
    //    //    $('#page-wrapper nav:eq(0) li:eq(0)').bind('click',function(){
    //    //        cookie.remove('userInfo'+loginUserName)
    //    //        location.href='../loginIndex.html'
    //    //    })
    //    //}
    //    //$('*').find('a:contains("新 增")').bind('click',function(){
    //    //    var btnHtml=$(this).parents().html()
    //    //    btnHtml=btnHtml.substring(btnHtml.indexOf('data-target='),btnHtml.indexOf(' onclick="clean()"',btnHtml.indexOf('data-target=')))
    //    //    var btnHtmlArray=btnHtml.split('=')
    //    //    $(btnHtmlArray[1].replace(/"/g,"")).on('shown.bs.modal',function(e){
    //    //        setTimeout(function(){
    //    //            $(e.currentTarget).find('input:eq(0)').focus()
    //    //        },500)
    //    //    })
    //    //})
    //})

//获取url内？后内容
    request = {
        QueryString : function(val){
            var uri = window.location.search;
            var re = new RegExp( "" + val + "=([^&?]*)", "ig" );
            return ( ( uri.match( re ) ) ? decodeURIComponent( uri.match( re )[0].substr( val.length + 1 ) ) : null );
        }/*,
         QueryHash: function(val){
         var uri = window.location.hash;
         var re = new RegExp("" +val+ "=([^#?]*)", "ig");
         return ((uri.match(re))?decodeURIComponent(uri.match(re)[0].substr(val.length+1)):null);
         }*/
    }

    var loginUserName = request.QueryString('username')

     commonUrlArray = {
        //TODO 登录/注册页
        insertUserUrl              : '/users/insertUser',//用户新增
        userLoginUrl               : '/users/userLogin',//用户登录
        updateUserPwdUrl           : '/users/updateUserPwd',//用户密码修改
        updateUserInfoUrl          : '/users/updateUserInfo',//用户信息修改


        //TODO 回答
        getAnswerListUrl            : '/answer/getAnswerList',//获取回答内容
        insertAnswerUrl             : '/answer/insertAnswer',//新增回答
        updateAnswerUrl             : '/answer/updateAnswer',//更新回答
        updateAnswerLabelUrl       : '/answer/updateAnswerLabel',//新增反馈
        deleteAnswerUrl             : '/answer/deleteAnswer',//删除问题
        getMyAnswerListUrl          : '/answer/getMyAnswerList',//获取我的回答内问题列表

         //TODO 大厅
         getProblemListUrl          : '/problem/getProblemList',//按条件查询问题列表
         insertProblemUrl           : '/problem/insertProblem',//新增问题
         insertFeedbackUrl           : '/feedback/insertFeedback',//新增反馈
         deleteProblemUrl           : '/problem/deleteProblem',//删除问题
         updateProblemUrl           : '/problem/updateProblem',//更新问题
         updateProblemStatusUrl    : '/problem/updateProblemStatus',//更新问题状态
         getMessageListUrl          : '/message/getMessageList',//获取信息列表


         //TODO 问题
         closeProblemUrl            : '/problem/closeProblem',//按条件查询问题列表
         getProblemStatusCountUrl  : '/problem/getProblemStatusCount',//获取问题进行数与完成数
         getProblemAndLabelUrl     : '/problem/getProblemAndLabel',//问题搜索接口
         getProblemDetailsUrl      : '/problem/getProblemDetails',//问题详情

        /**常量接口***/
        commonConstantUrl:[
            { getLabelListUrl          : '/label/getLabelList' }//获取标签
        ]
    }

    pageInnerConfig = function (){
        this.toPage = 1;
        this.pageSize = 5;
        this.maxPage = null;
        this.currentPage = null;
        this.isChangePage = false;
        this.searchAllCount = false;
        this.currentId = null;
        this.searchData = {
            "problemStatus" : "",
            "problemMoney" : '',
            "userId" : "",
            problemTime : ''
        };
        this.toPage = 1;
        return this;
    }

//时间转换类
    timeTransformGroupClass = function () {
        this.accurateTime = 'yyyy-MM-dd hh:mm'
        this.fuzzyTime = 'yyyy-MM-dd'
        this.MonthAndDayTime = 'MM-dd hh:mm'
        this.toBackEndTime = 'yyyy-MM-dd hh:mm:ss'
        this.timeTransformGroup = {
            problemCreateTime :{ format : this.toBackEndTime },
            answerCreateTime :{ format : this.fuzzyTime },
            messageCreateTime :{ format : this.fuzzyTime },

            //TODO 搜索特有时间
            takeAwayTimeOfStart : { format : this.fuzzyTime },
            takeAwayTimeOfOver : { format : this.fuzzyTime },
            leaseEndTimeOfStart : { format : this.fuzzyTime },
            leaseEndTimeOfOver : { format : this.fuzzyTime },
            createTimeOfStart : { format : this.fuzzyTime },
            startTimeOfStart : { format : this.fuzzyTime },
            endTimeOfStart : { format : this.fuzzyTime }
        }
        this.dateTransformFunc = function( date ){
            for( var i in this.timeTransformGroup ){
                //console.log( new Date( date[i] ) )
                date[i] == '' ? date[i] = '' : date[i] = new Date( new Date( date[i] ).getTime()/**** - 8 * 60 * 60 * 1000**/).Format( this.timeTransformGroup[i].format )
            }
            return date
        }
        this.dateTransformFuncBack = function( date ){
            for(var i in this.timeTransformGroup){
                if( i == 'placeOrderTime' || i == 'takeAwayTimeOfStart' || i == 'leaseEndTimeOfStart' /*|| i == 'createTimeOfStart' */|| i == 'startTimeOfStart' || i == 'endTimeOfStart' )
                    date[i] == undefined ? '' : date[i] = new Date( date[i] + ' 00:00' ).Format( this.toBackEndTime );
                else
                    date[i] == undefined ? '' : date[i] = new Date( date[i] ).Format( this.toBackEndTime );
            }
            return date
        }
    }

     dataTransform = function( validData ){
        if( validData.length >= 1 ){
            for( var i in validData ){
                validData[i] = translateDefaultValue( new timeTransformGroupClass().dateTransformFunc( validData[i] ), 'get' )
            }
        }
        else{
            validData = translateDefaultValue( new timeTransformGroupClass().dateTransformFunc( validData ), 'get' )
        }
        return validData;
    }

    dateTransFormBack = function( validData ){
        if( validData.length >= 1 ){
            for( var i in validData ){
                validData[i] = new timeTransformGroupClass().dateTransformFuncBack( validData[i] )
            }
        }
        else{
            validData = new timeTransformGroupClass().dateTransformFuncBack( validData )
        }
        return validData;
    }

    getAjax = function ( url, params, callback ){

        params = dateTransFormBack( translateDefaultValue( params, 'post' ) )

        var param = {
            url : appSocket + url + '?' + decodeURIComponent( $.param( params ) ).replace( /'/, '' ),
            data : {},
            method : 'get'
        }

        ajaxRequest( param, callback )

    }

    postAjax = function ( url, data, callback ){

        data = dateTransFormBack( translateDefaultValue( data, 'post' ) );

        var param = {
            url : appSocket + url,
            data : data,
            method : 'post'
        }

        ajaxRequest( param, callback )
    }



    AppConfig = function( judge ){
        var _me = this;
        var appSocketJudegeFunc = function( innerJudge ){
            var appSocketJudegeFuncInnerUrl
            if( innerJudge ){
                //TODO 跨域ajax
                //appSocketJudegeFuncInnerUrl =  'http://10.0.2.176:3000';
                //appSocketJudegeFuncInnerUrl =  'http://117.25.129.232:15409';//外网
                //appSocketJudegeFuncInnerUrl =  'http://10.0.2.21:3009';//外网
                appSocketJudegeFuncInnerUrl = 'http://192.168.137.155:3000';
                //appSocketJudegeFuncInnerUrl = 'http://192.168.10.207:3333/Skyroam_OES';
                //appSocketJudegeFuncInnerUrl = 'http://192.168.173.1:3333/Skyroam_OES';
                //appSocketJudegeFuncInnerUrl = 'http://192.168.3.231:3333/Skyroam_OES';
                //appSocketJudegeFuncInnerUrl = 'http://192.168.6.65:3333/Skyroam_OES';
                //appSocketJudegeFuncInnerUrl = 'http://192.168.1.101:3333/Skyroam_OES';
            }
            else{
                //TODO 本地服务ajax
                appSocketJudegeFuncInnerUrl = '';
            }
            return appSocketJudegeFuncInnerUrl
        }
        _me.judgement = judge
        _me.appSocket = appSocketJudegeFunc( judge )
        _me.ajaxRequest = function( params, CallBack ){
            var innerUrl,
                innerData,
                innerMethod,
                UndealData;

            for( var i in params.data ){
                try{
                    if( i == 'null' || i == null ) delete params.data[ i ]
                }
                catch( err ){
                    console.log( 'deleteNullError------', err )
                }

                try{
                    if( i == 'payTypeOfForegift' && params.data[i] == 5 )  params.data[ 'realForegift' ] = 0
                }
                catch( err ){
                    console.log( 'payTypeOfForegiftError------', err )
                }
            }

            ats( params );

            if( _me.judgement ){
                //TODO 跨域ajax
                innerUrl    =  '/commonAction/ajaxRequest';
                innerData   = params;
                innerMethod = 'post';
            }
            else{
                //TODO 本地服务ajax
                innerUrl       = params.url;
                innerData      = params.data ;
                innerMethod    = params.method;
            }


            var ajax = $.ajax({
                url  : innerUrl,
                data : innerData,
                type : innerMethod,
                async: true,
                beforeSend : function( request ) {
                    request.setRequestHeader( "token", localStorage.getItem('token') );
                },
                dataType : "json",
                success : function( data ){
                    commonFunc.ajaxSuccessFuc( data, CallBack )
                },
                timeout : 60 * 1000,
                error : function( err ){
                    if( err.statusText == 'timeout' ) {

                        selfMask == undefined ? null : selfMask.end()

                        myAlert("请求超时");

                        ajax.abort();

                    }
                }
            });
        }
    }

    commonFunc = {
        dateTimeBind : function(){
            try{
                $('.timeAccurate').datetimepicker({
                    minView:'2',
                    format : 'yyyy-MM-dd',
                    pickTime: false,
                    autoclose:true,
                    forceParse:false,
                    language:"zh-CN",
                    todayBtn:  1
                });
                $('.timeAccurateTakeAwayTime').datetimepicker({
                    minView:'0',
                    format : 'yyyy-MM-dd hh:ii',
                    pickTime: false,
                    autoclose:true,
                    language:"zh-CN",
                    todayBtn:  1
                });
                //$('.timeAccurate').datepicker( {
                //    format: 'yyyy-MM-dd',
                //    pickTime: false,
                //    autoclose: true,
                //    todayHighlight: true,
                //    language:"cn"
                //    //endDate: "today"
                //    //startDate: "today"
                //} );
            }
            catch( err ){
                console.log('无需时间控件')
            }
        },
        ajaxSuccessFuc:function( data, callback ){

            $('#exWarehouseSaveBtn').attr( 'disabled', false )
            $('#inWarehouseSaveBtn').attr( 'disabled', false )

            ats(data)
            if(data.status){
                if( data.status == 200 ){
/*                    if( data.recordset && data.recordset.length > 0 ){
                        for( var i in data.recordset ){
                            data.recordset[i] = insertDefaultValue( data.recordset[i] )
                        }
                    }
                    else if( !isNull( data.record ) ){
                        data.record = insertDefaultValue( data.record )
                    }*/
                    data.token ? localStorage.setItem( 'token', data.token ) : ''

                    callback( data )

                }
                else if( data.status == 500 ){
                    data.token ? localStorage.setItem( 'token', data.token ) : ''

                    selfMask == undefined ? null : selfMask.end()

                    typeof(data.exception)=='string'?'':data.exception=JSON.stringify(data.exception)

                    data.exception ? myAlert( data.exception ) : myAlert( '系统异常' )

                    _click_piging = false;

                    return false;
                }
                else if( data.status == 401 ){
                    myAlert('请重新登录',function(){
                        location.href="login.html"
                    })
                    return false;
                }
            }
            else callback(data)
        },

        ajaxDataFormTransformGet:function( dataForm, data ){
            if( /*typeof( data ) == 'string'*/  data instanceof Array ){
                 //dataForm.ajaxGetType == 'array' ? data = JSON.parse( data ) : data;
                if( data instanceof Array && dataForm.meaningTranslate ){
                    for( var i in  data ){
                        data[ i ] = commonFunc.meaningTranslateGet( dataForm, data[ i ] );
                    };
                }
            }

             return data
        },
        ajaxDataFormTransformSend:function( dataForm, data ){

            if( typeof( data ) == 'object' ){

                if( data instanceof Array && dataForm.meaningTranslate ){
                    for( var i in  data ){
                        data[ i ] = commonFunc.meaningTranslateSend( dataForm, data[ i ] );
                    };
                }

                //dataForm.ajaxSendType == 'string' ? data = JSON.stringify( data ) : data

            }

            return data
        },

        meaningTranslateGet:function( dataForm, data ){
            for( var i in dataForm.meaningTranslate ){
                if( dataForm.meaningTranslate[i].back == data ) return dataForm.meaningTranslate[i].front
            }
            return data
        },
        meaningTranslateSend:function( dataForm, data, onlySKUSend ){
            if( onlySKUSend ){
                for( var o in dataForm[ onlySKUSend ] ){
                    if( dataForm[ onlySKUSend ][o].skuName == data ) return dataForm[ onlySKUSend ][o].skuId
                }
            }
            else{
                for( var i in dataForm.meaningTranslate ){
                    if( dataForm.meaningTranslate[i].front == data) return dataForm.meaningTranslate[i].back
                }
            }
            if( onlySKUSend ) console.log( 'SKU无法映射-----', data )
            return data
        },
        modalAttrLocate : function( label, modalName ){
            var locateString = ''
            for( var i in label ){
                locateString += ( label[i] + '[' + modalName + 'Id],')
            }
            locateString = locateString.slice( 0, -1 )
            return locateString
        },
        SKUFunc:function( bindModel, callback ){
            //bindModel(allConstant.SKUList)
            callback()
        },
        storeConstantFunc : function( urlArray, href ){

            var /*orderStatusConstant = [
                    { name : '待取机', id : '5' },
                    { name : '待还机', id : '6' },
                    { name : '已完成', id : '7' },
                    { name : '待完善', id : '8' },
                    { name : '已撤销', id : '1' }
                ],*/ returnArray = {}, returnArraySKUList = {}, storeSKUListTranslate = [], GroupList = '', that = this,

                getIt = function( urlObject ){
                    for( var u in urlObject ){
                        var keyName = u.replace( 'get', '' ).replace( 'Url', '' )
                        var keyValue = urlObject[u]
                    }
                    console.log( 'send------------' + keyName )
                    getAjax( keyValue, {}, function( data ){
                        console.log( 'get------------' + keyName )
                        returnArray[ keyName ] = data.recordset ? data.recordset : data;
                        keyName == 'LabelList' ? that.storeLabelListRule( data, 'LabelListRule' ) : null;
                        //i++
                        //circuIt(i)
                        if( urlArray.length == getPropertyCount( returnArray ) /*&& getPropertyCount( returnArraySKUList ) == ( GroupList != '' ? GroupList.length : 100000000 )*/ ) storeIt( returnArray )
                    })
                },

            //获取JSON对象长度
                getPropertyCount = function ( o ){
                    var n, count = 0;
                    for( n in o ){
                        if( o.hasOwnProperty( n ) ){
                            count++;
                        }
                    }
                    return count;
                },

                storeIt = function( constant ){
/*                    constant['OrderStatus'] = orderStatusConstant
                    constant['Permission']  = permissionLoginAccount
                    constant['SKUList']     = {}*/
                    selfMask.end()
                    localStorage.setItem( 'constant', JSON.stringify( constant ) )

                    href ? location.href = href : ''

                },

                circuIt = function( I ){
                    //I ? i = I : i = 0
                    //if( urlArray.length == i ) storeIt( returnArray )
                    //else getIt( urlArray[i] )
                    for( var i in urlArray ){
                        if( urlArray[i].findSKUListUrl == undefined ) getIt( urlArray[i] );
                    }
                };

            circuIt()
        },
        getSKUListUrl : function(){
            for( var i in commonUrlArray.commonConstantUrl ){
                if( commonUrlArray.commonConstantUrl[i].findSKUListUrl == '/constants/findSKUList' ) return commonUrlArray.commonConstantUrl[i]
            }
        },
//TODO 判断并存取套餐与映射关系
        getItSKUList : function( pref, next ){
            var _father = this, getSKUListUrl = _father.getSKUListUrl(), constant = JSON.parse( localStorage.getItem( 'constant' ) );


            if( constant['SKUList'][ pref ] ) next()
            else{


                if( isNull( pref ) == true ) {

                    allConstant = constant;
                    localStorage.setItem( 'constant', JSON.stringify( constant ) );

                    return false;

                }

                getAjax( getSKUListUrl.findSKUListUrl, { gid : pref }, function( data ){
                    constant = JSON.parse( localStorage.getItem( 'constant' ) )
                    /*            if( constant['SKUList'][ pref ] ) next();
                     else{*/
                    _father.storeSKUListRule( data, 'SKUList' );
                    constant['SKUList'][ pref ] = data;
                    allConstant = $.extend( {}, constant );
                    localStorage.setItem( 'constant', JSON.stringify( constant ) );
                    next()
                    /*}*/
                    //i++
                    //circuIt(i)
                })

            }
        },
        storeLabelListRule : function( undealArray, storeName ){
            var meaningTranslate = new Array()

            if( undealArray.recordset ){
                undealArray = undealArray.recordset
            }
            for( var i in undealArray ){
                var newObject = { front : /*storeName == "LabelListRule" ? */undealArray[i].labelTitle, back : undealArray[i].labelId }
                meaningTranslate.push( newObject )
            }
            localStorage.setItem( storeName, JSON.stringify( meaningTranslate ) );

            return;
        },
        storeGroupIDListRule : function( undealArray, storeName){
            var meaningTranslate = new Array()
            for( var i in undealArray ){
                var newObject = { front : undealArray[i].groupName, back : undealArray[i].groupId }
                meaningTranslate.push( newObject )
            }
            localStorage.setItem( storeName, JSON.stringify( meaningTranslate ) )
        },
        storeSKUListRule : function( undealArray, storeName){
            for( var i in undealArray ){
                var newObject = { front : undealArray[i].skuName, back : undealArray[i].skuId }
                SKUListTranslate.push( newObject )
            }
            localStorage.setItem( storeName, JSON.stringify( SKUListTranslate ) )
        },
        checkStatusFunc:function( callback ){
            var that = this
            $('.checkStatusBindClass').each( function(){
                var checkStatusTpl = ''
                for( var i in allConstant.DamageList ){
                    checkStatusTpl += '<option value="' + allConstant.DamageList[i].id + '" price="' + allConstant.DamageList[i].price + '">' + allConstant.DamageList[i].name + '</option>'
                }
                $( this ).append( checkStatusTpl )/*.prepend(commonFunc.selectFirstOption)*/
            })
            callback()
        },
        inputTypeCheckClass : function(){
            this.numberTypeCheck = function(){
                $('.numberType').bind( 'input', function(){
                    if( this.value.match( /^[0-9]+$/g ) == null ) this.value = this.value.substring( 0, this.value.length - 1 )
                })
            }
        },
        necessaryData : function( data, modalName, compareContent ){
            var trueOrFalse = true;
            !compareContent ? this.dataContent = {
                userPhone      : { default : '', type : Number },     //用户电话
                userName       : { default : '', type : String },//用户姓名
                userEmail      : { default : '', type : String },//用户邮箱
                problemTitle      : { default : '', type : String },     //问题标题
                //problemContent       : { default : '', type : String },//问题内容
                //problemLabel      : { default : '', type : Array },//问题标签
                problemIntegral       : { default : '', type : Number },    //问题积分
                password       : { default : '', type : String }    //用户密码
            } : this.dataContent = compareContent;

            if( isNull( data ) ) return false;

            var necessaryDataInnerFunc = function( id, color ){
                if( $('*[' + modalName + 'Id="' + id + '"]').css('background-color') == 'rgb(240, 128, 128)' ) return false;
                $('*[' + modalName + 'Id="' + id + '"]').css( 'background-color', color )
            }
            var necessaryDataInnerForAirportMessFunc = function( id, color ){
                if( $('#'+ id ).css('background-color') == 'rgb(240, 128, 128)' ) return false;
                else $('#'+ id ).css( 'background-color', color )
            }
            var innerBGColor = '#FFFFFF'

            for( var i in this.dataContent ){
                if( data[i] !== undefined && isNull( data[i] ) ){
                    innerBGColor = 'lightBlue'
                    trueOrFalse = false
                }
                else {
                    innerBGColor = '#FFFFFF'
                }
                modalName ? necessaryDataInnerFunc( i, innerBGColor ) : necessaryDataInnerForAirportMessFunc( i, innerBGColor )
            }

            return trueOrFalse;
        },
        selectFirstOption : function( name ){
            return '<option value="">' + ( name ? name : '请选择' ) + '</option>'
        },
        justShowAndDisabledFunc : function(){
            $('.justShow').attr( 'disabled', true )
        },
        permissonBtnJudgementFunc : function( callback ){
            var permissionArray = new Array()
            for( var i in allConstant.Permission ){
                permissionArray.push( allConstant.Permission[i].menuID )
            }
            $('.permissionBtnGroup').each(function(){
                if( $( this ).attr('permissionBtnId') == 21 && ( this.tagName == 'TD' || this.tagName == 'TH' )){
                    if( $.inArray( parseInt( $( this ).attr( 'permissionBtnId' ) ), permissionArray ) > -1 ) {
                        $.inArray( 14, permissionArray ) > -1 ? $( this ).removeClass('permissionBtnGroup') : $( this ).removeClass('permissionBtnGroup').children('div').text('查 看')
                    }
                    else $( this ).remove()
                }
                else $.inArray( parseInt( $( this ).attr('permissionBtnId') ), permissionArray ) > -1 ? $( this ).removeClass('permissionBtnGroup') : $( this ).remove()
            })
            new commonFunc.inputTypeCheckClass().numberTypeCheck()
            callback ? callback() : ''
        },
        cookieSaveTime : 30 * 60 * 1000,
        rentPrice : 500,
        isLoginFunc : function(){
            allConstant == '' ? this.ajaxSuccessFuc( { status : 401 }, null ):
                /*展示用户名*/$('strong[ class = "font-bold" ]').text( localStorage.getItem('userName') || null ).css( 'visibility', 'visible')
        },
        paymentStatusArray : [
            { front : '支付中',     back : 1 },
            { front : '支付成功',   back : 2 },
            { front : '支付失败',   back : 3 },
            { front : '退款中',     back : 4 },
            { front : '退款成功',   back : 5 },
            { front : '退款失败',   back : 6 }
        ],
        JsonLStorageSet : function ( name, value ) {
            ( typeof value ).toLowerCase() == 'object' ? localStorage.setItem( name,  JSON.stringify( value ) ) : '';
            return;
        },
        JsonLStorageGet : function ( name ) {
            return JSON.parse( localStorage.getItem( name ) );
        }
    }

    var specialAppConfig = new AppConfig( wetherDevelopement )

    ajaxRequest = specialAppConfig.ajaxRequest

    appSocket = specialAppConfig.appSocket

//自制alert框
    myAlert = function( msg, callback ){
        var modelID = 'modal-alert-self-made' + new Date().getTime().toString()
        var showMsgID = 'alertTips'
        var myAlertModel = '<!--alert模态框--><div class="modal inmodal fade" id="'+modelID+'" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;"><div class="modal-dialog "><div class="modal-content animated fadeIn"><div class="modal-header M-modal-header"><button type="button" class="close close-it" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div><div class="modal-body"><h3 style="word-break: break-all" id="'+showMsgID+'" class="text-center"></h3></div><div class="modal-footer"><button type="button" class="btn btn-primary" id="alertBtn" data-dismiss="modal">确 认</button></div></div></div></div>'
        $('body').append( myAlertModel )
        //$('#alertBtn').bind('click',function(){
        //    callback()
        //}):''
        $('#' + modelID ).modal('show').find('#' + showMsgID ).text( msg )
        $('#' + modelID ).on('hidden.bs.modal',function(){
            callback ? callback() : null
            this.remove()
        })
    }

//自制confirm框
    myConfirm = function( msg, func, params ){
        var modelID = 'modal-confirm-self-made' + new Date().getTime().toString()
        var showMsgID = 'confirmDeleteTips'
        var myAlertModel = '<!--自制确认模态框--><div class="modal inmodal fade" id="' + modelID + '" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;"><div class="modal-dialog "><div class="modal-content animated fadeIn"><div class="modal-header M-modal-header"><button type="button" class="close close-it" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div><div class="modal-body"><h3 style="word-break: break-all" id="' + showMsgID + '" class="text-center"></h3></div><div class="modal-footer"><button type="button" class="btn btn-white" data-dismiss="modal">取 消</button><button type="button" class="btn btn-primary" id="confirmBtn">确 认</button></div></div></div></div>'
        $('body').append( myAlertModel )
        $('#' + modelID ).modal('show').find('#' + showMsgID ).text( msg )
        $('#' + modelID ).on( 'hidden.bs.modal', function(){
            this.remove()
        })
        $('#confirmBtn').bind('click',function(){
            $('#' + modelID ).modal('hide')
            func( params )
        })
    }

    commonPasswordFunc = function(){
        var modelID = 'modal-codeModify'
        var that = this
        this.oldPassword = ''
        this.newPassword = ''
        this.rekeyPassword = ''
        this.modelName = 'codeModify'
        this.submitPasswordUpdate = function(){
            var oldValue = $('*[' + this.modelName + 'Id="oldPassword"]').val()
            var newValue = $('*[' + this.modelName + 'Id="newPassword"]').val()
            var rekeyValue = $('*[' + this.modelName + 'Id="rekeyPassword"]').val()
            if(newValue != rekeyValue) { myAlert('输入的确认密码有误'); return false; }
            var param ={
                userID : localStorage.getItem('userID'),
                password : $.md5( oldValue )/*oldValue*/,
                newPassword : $.md5( newValue )/*newValue*/
            }
            postAjax( commonUrlArray.updatePasswordUrl, param, function( data ){
                if( data.status == 200 ){
                    $('#' + modelID ).modal('hide')
                    myAlert( data.record );
                }
            })
        }
        var myAlertModel='<!--密码modal编辑--><div class="modal inmodal fade" id="modal-codeModify" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;"><div class="modal-dialog"><div class="modal-content animated bounceInRight"><div class="modal-header M-modal-header"><span class="modal-header-title">密码修改</span><button type="button" class="close close-it" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div><div class="modal-body"><form class="form-horizontal"><div class="form-group"><label class="col-lg-2 control-label">旧密码</label><div class="col-lg-10"><input type="text" '+this.modelName+'Id="oldPassword" value="'+this.oldPassword+'" class="form-control"/></div></div><div class="form-group"><label class="col-lg-2 control-label">新密码</label><div class="col-lg-10"><input type="password"'+this.modelName+'Id="newPassword" value="'+this.newPassword+'" class="form-control"/></div></div><div class="form-group"><label class="col-lg-2 control-label">再次确认</label><div class="col-lg-10"><input type="password" '+this.modelName+'Id="rekeyPassword" value="'+this.rekeyPassword+'" class="form-control"/></div></div></form></div><div class="modal-footer"><button type="button" class="btn btn-white" data-dismiss="modal">取 消</button><button type="button" class="btn btn-primary" id="passwordUpdateBtn">确 认</button></div></div></div></div>'
        $('body').append( myAlertModel )
        $('#' + modelID).modal('show')
        $('#' + modelID).on('hidden.bs.modal',function(){
            this.remove()
        })
        $('#passwordUpdateBtn').unbind('click').bind('click',function(){
            that.submitPasswordUpdate()
        })
    }

//分页处理
    function paging( listdata, toPage ){
        $('.wrapper-content').css( 'visibility', 'visible' )
        var topage = toPage;/*到哪一页*/
        /*分页判断start*/
        pagesnum = listdata;/*总页数*/
        var pages = [];
        if( topage >= 3 && ( pagesnum - topage ) >= 3 ){
            var str=[];
            var spage = topage-3;
            for(var i=1;i<=5;i++){
                str[i-1]={page:spage+i}
            }
            pages = {currentpage:topage,pages:str};
            return pages;
        }else if(topage<3&&(pagesnum-topage)<3){
            var str=[];
            for(var i=1; i<=pagesnum; i++ ){
                str[i-1]={page:i}
            }
            pages = {currentpage:topage,pages:str};
            return pages;
        }else if( topage >= 3 && ( pagesnum - topage ) < 3 ){
            if(topage<=4){
                var str=[];
                for(var i=1;i<=pagesnum;i++){
                    str[i-1]={page:i}
                }
                pages = {currentpage:topage,pages:str};
            }else{
                var str=[];
                var spage = pagesnum-5;
                for(var i=1;i<=5;i++){
                    str[i-1]={page:spage+i}
                }
                pages = {currentpage:topage,pages:str};
            }
            return pages;
        }else if(topage<3&&(pagesnum-topage)>=3){
            var str=[];
            var j;
            if(pagesnum<=5){
                j=pagesnum;
            }else{
                j=5;
            }
            for(var i=1;i<=j;i++){
                str[i-1]={page:i}
            }
            pages = {currentpage:topage,pages:str};
        }
        return pages;
        /*分页判断end*/
    }


//获取当前时间
    getNow = function( fmt ){
        return new Date().Format( fmt )
        //var year=time.getFullYear()
        //var month=time.getMonth()+1
        //if(month<10){
        //    month='0'+month
        //}
        //var day=time.getDate()
        //var hour=time.getHours()
        //if(hour<10){
        //    hour='0'+hour
        //}
        //var minute=time.getMinutes()
        //if(minute<10){
        //    minute='0'+minute
        //}
        //var second=time.getSeconds()
        //if(second<10){
        //    second='0'+second
        //}
        //var now=year+"-"+month+"-"+day+" "+hour+":"+minute+':'+second
        //return now
    }

    Date.prototype.Format = function(fmt){
        fmt ? null : fmt = new timeTransformGroupClass().accurateTime
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor( (this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt = fmt.replace( RegExp.$1 , ( this.getFullYear() + "" ).substr( 4 - RegExp.$1.length ) );
        for(var k in o)
            if( new RegExp("("+ k +")").test( fmt ) )
                fmt = fmt.replace( RegExp.$1 , ( RegExp.$1.length == 1 ) ? ( o[k] ) : ( ( "00" + o[k] ).substr( ( "" + o[k]).length ) ) );
        fmt = fmt.indexOf('NaN') > -1 ? '' : fmt
        return fmt;
    };

//转JSON格式的alert
    function ats( l ){
        alert( JSON.stringify( l ) )
        //wetherDevelopement ? alert( JSON.stringify( l ) ) : null;
    }

//元素内判断input:text是否为空
    function alertEmpty( modalName ){
        var judge = 0
        $( modalName + " input:text[name='alertEmpty']").each( function(){
                if( $( this ).val() == ""){
                    var emptyName = $( this ).parents().prev('label').text().replace( /：/, '' )
                    alert( emptyName + "不能为空" );
                    judge = 1
                }
            }
        );
        if( judge == 0 ){
            return true
        }
    }

//手机格式验证，用于if类型判断
    phoneFormTest = function (phone){
        var reg = /^(1[34578][0-9]{9})$/
        //var reg=/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(13\d{9}$)|(15[0135-9]\d{8}$)|(18[267]\d{8}$)|(^[0-9]{3,4}\-[0-9]{3,4}\-[0-9]{3,4}$)/
        if( reg.test( phone ) ){
            return true;
        }
        else {
            return false;
        }
    }

//邮箱格式验证，用于if类型判断
    emailFormTest = function (email){
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if( reg.test( email ) ){
            return true;
        }
        else {
            return false;
        }
    }

    /***cookie内JSON转化为数组**/
    function json_decode(str_json) {
        // Decodes the JSON representation into a PHP value
        //
        // version: 906.1806
        // discuss at: http://phpjs.org/functions/json_decode
        // +      original by: Public Domain (http://www.json.org/json2.js)
        // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // + improved by: T.J. Leahy
        // *     example 1: json_decode('[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]');
        // *     returns 1: ['e', {pluribus: 'unum'}]
        /*
         http://www.JSON.org/json2.js
         2008-11-19
         Public Domain.
         NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
         See http://www.JSON.org/js.html
         */

        var json = this.window.JSON;
        if (typeof json === 'object' && typeof json.parse === 'function') {
            return json.parse(str_json);
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var j;
        var text = str_json;

        // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

        // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with '()' and 'new'
        // because they can cause invocation, and '=' because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.

        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
        // replace all simple value tokens with ']' characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
        if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            // In the third stage we use the eval function to compile the text into a
            // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
            // in JavaScript: it can begin a block or an object literal. We wrap the text
            // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

            return j;
        }

        // If the text is not JSON parseable, then a SyntaxError is thrown.
        throw new SyntaxError('json_decode');
    }

    /***cookie内数组转化为JSON**/
    function json_encode(mixed_val) {
        // Returns the JSON representation of a value
        //
        // version: 906.1806
        // discuss at: http://phpjs.org/functions/json_encode
        // +      original by: Public Domain (http://www.json.org/json2.js)
        // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // + improved by: T.J. Leahy
        // *     example 1: json_encode(['e', {pluribus: 'unum'}]);
        // *     returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'
        /*
         http://www.JSON.org/json2.js
         2008-11-19
         Public Domain.
         NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
         See http://www.JSON.org/js.html
         */
        var json = this.window.JSON;
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            return json.stringify(mixed_val);
        }

        var value = mixed_val;

        var quote = function ( string ) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
        };

        var str = function(key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0;          // The loop counter.
            var k = '';          // The member key.
            var v = '';          // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                            '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' :
                        gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });
    }

//cookie的增、删、查
    var cookie = {
        set:function( name, value ){
            var exp = new Date();
            exp.setTime(exp.getTime() + commonFunc.cookieSaveTime);
            document.cookie=name+"="+escape(value)+";expires="+exp.toGMTString()
        },
        get:function( name ){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        remove:function( name ){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=cookie.get(name);
            if(cval!=null)
                document.cookie = name + "="+cval+";expires="+exp.toGMTString()
        }
    }

//监听键盘事件，需要JQuery支持
    addListeningKeyDown = function ( where, whichKey, whereClick ){
        if( $( where ).focus() ){
            $( where ).on( 'keydown', function(){
                if( event.keyCode == whichKey ){
                    $( whereClick ).trigger( 'click' )
                }
            })
        }
    }

//判断value非boolean类型是否为空
    isNull = function ( arg1 )
    {
        return !!( !arg1 && arg1 !== 0 && typeof arg1 !== "boolean" /*&& ( arg1 instanceof Array && arg1.length === 0 ) && ( arg1 instanceof Object && JSON.stringify( arg1 ) === '{}' )*/);
    }

    allDataJSON = {
        userPhone      : { default : '', type : Number },     //用户电话
        userName       : { default : '', type : String },//用户姓名
        password       : { default : '', type : String },     //用户密码
        userEmail      : { default : '', type : String },   //用户邮箱
        createTime     : { default : '', type : Date },      //创建时间
        updateTime     : { default : '', type : Date },  //更新时间

        //TODO 问题接口内
        id              : { default : '', type : String },     //问题ID
        problemTitle  : { default : '', type : String },//问题标题
        problemCreateTime : { default : '', type : String },     //问题创建时间
        problemAuthor : { default : '', type : String },   //提问人
        userId         : { default : '', type : String },      //用户标识ID
        problemLabel   : { default : [], type : Array, ajaxSendType : 'string', ajaxGetType : 'array', translateIt : function( data, method ) {
            return  method=='get'?commonFunc.ajaxDataFormTransformGet( this, data ) : commonFunc.ajaxDataFormTransformSend( this, data )
        }, meaningTranslate : commonFunc.JsonLStorageGet( 'LabelListRule' ) },  //问题标签
        problemStatus  : { default : '', type : Array, translateIt:function(data,method){
            return  method=='get'?commonFunc.meaningTranslateGet( this, data ):commonFunc.meaningTranslateSend(this,data)
        },meaningTranslate:[
            {front:'进行中',back:0},
            {front:'已采纳',back:1},
            {front:'已关闭',back:2},
            {front:'已结束',back:3}
        ] },  //问题状态
        problemIntegral : { default : '', type : Array },  //问题积分
        answerDate      :
            [{
                "id"    : {type:String,default:''},//回答ID
                "answerCreateTime":{type:String,default:''},//回答生成时间
                "answerStatus":{ type:String, default:'', translateIt:function(data,method){
                    return  method=='get'?commonFunc.meaningTranslateGet( this, data ):commonFunc.meaningTranslateSend(this,data)
                },meaningTranslate:[
                    {front:'未采纳',back:0},
                    {front:'已采纳',back:1}
                ]},//回答状态
                "userId"       : {type:String,default:''},//回答人ID
                "answerer"     : {type:String,default:''},//回答人姓名
                "answerContent": {type:String,default:''},//回答内容
                "problemId"   : { type:String,default:''},//对应问题ID
                "checkStatus" : { type:String,default:''}//是否被检查过
            }],//问题内回答列表
        "answerStatus":{ type:String, default:'', translateIt:function(data,method){
            return  method=='get'?commonFunc.meaningTranslateGet( this, data ):commonFunc.meaningTranslateSend(this,data)
        },meaningTranslate:[
            {front:'未采纳',back:0},
            {front:'已采纳',back:1}
        ]},//回答状态
        answerCount     : { default : '', type : Array },  //回答总数
        unCheckCount    : { default : '', type : Array },  //为确认回答数
        problemEvaluate : { default : '', type : Array },  //问题评估星数
        problemOpinion  : { default : '', type : Array },  //问题评估内容

        problemMoney     : { default : '', type : Array },  //用来作为金钱的升降序    1降序   2.升序
        problemTime    : { default : '', type : Array },  //用来判断是时间的升降序   1降序   2.升序

        //TODO 标签相关接口
        destination:{default:[],ajaxSendType:'string',ajaxGetType:'array',translateIt:function(data,method){
            return  method=='get'?commonFunc.ajaxDataFormTransformGet(this,data):commonFunc.ajaxDataFormTransformSend(this,data)
        }}//目的地
/*        problemTitle  : { default : '', type : String },//问题标题
        problemCreateTime : { default : '', type : String },     //问题创建时间
        problemAuthor : { default : '', type : String },   //提问人
        userId         : { default : '', type : Date },      //用户标识ID
        problemLabel   : { default : [], type : Array },  //问题标签
        problemStatus  : { default : '', type : Array, translateIt:function(data,method){
            return  method=='get'?commonFunc.meaningTranslateGet( this, data ):commonFunc.meaningTranslateSend(this,data)
        },meaningTranslate:[
            {front:'进行中',back:0},
            {front:'已完成',back:1},
            {front:'已关闭',back:2}
        ] } */ //问题状态
    }

    translateDefaultValue = function( validData, method ){
        for( var j in allDataJSON ){

            if( !isNull( validData[j] ) ){
                if( j == 'answerDate' && validData[j] ) {
                    for( var k in allDataJSON[j][0] ){
                        if( allDataJSON[j][0][k].translateIt ) {
                            for( var o in validData[j] ){
                                validData[j][o][k] = allDataJSON[j][0][k].translateIt( validData[j][o][k], method )
                            }
                        }
                    }
                }
                else allDataJSON[j].translateIt ? validData[j] = allDataJSON[j].translateIt( validData[j], method ) : ''

            }
        }
        return validData;
    }

/*
    insertDefaultValue = function( data ){
        for( var i in allDataJSON ){
            if( i == 'answerDate' ){
                if( isNull( data[i] ) ){
                    data[i] = []
                }
                else{
                    for( var j in allDataJSON[i][0] ){
                        for( var k in data[i] ){
                            data[i][k][j] = isNull( data[i][k][j] ) ? allDataJSON[i][0][j].default : data[i][k][j]
                        }
                    }
                }
            }
            else if( isNull( data[i] ) ){
                data[i] = allDataJSON[i].default
            }
            else if( allDataJSON[i].ajaxGetType ){
                //allDataJSON[i].ajaxGetType== typeof( data[i] )?JSON.stringify(data[i]):JSON.parse(data[i])
            }
        }
        return data;
    }
*/


    selfMask = {
        start : function(){
            $('.fullscreen-mask').show()
        },
        end : function(){
            $('.fullscreen-mask').hide()
        }
    };

    return this;
})
