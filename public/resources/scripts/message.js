/**
 * Created by LeonDKing on 2015/12/23.
 */

require.config( {
    deps: [
        "jquery", "bootstrap", "common"
    ],
    urlArgs: "v=" + new Date().getTime(),
    waitSeconds: 0,
    // 资源基础路径，其他路径都在此前进或后退
    baseUrl: "resources/scripts/",
    paths: {
        "jquery"    : "lib/jquery-2.1.1",
        "bootstrap" : "lib/bootstrap-3.3.5/bootstrap.min",
        "common" 	 : "fwk/common",
        "summernote" 	: "lib/summernote/summernote.min",
        "summernote-zh-CN" 	: "lib/summernote/summernote-zh-CN",
        "Ractive" 	: "lib/Ractive",
        "chosen" 	: "lib/chosen/chosen.jquery",
        "md5" 	: "lib/jQuery.md5",
        "codemirror" 	: "lib/codemirror/codemirror"
    },
    // 配置依赖,js存在加载先后顺序
    shim : {
        "bootstrap" : {
            deps: [ "jquery" ]
        },
        "summernote-zh-CN" : {
            deps: [ "jquery", "summernote" ]
        },
        "summernote" : {
            deps: [ "codemirror" ]
        },
        "chosen" : {
            deps: [ "jquery" ]
        },
        "md5" : {
            deps: [ "jquery" ]
        }
    }
} );

( function ( global ) {
    window.console = window.console ? window.console : {
        log: function(){},
        debug: function(){},
        info: function(){},
        warn: function(){},
        error: function(){}
    };

    require( [ 'jquery', 'common', 'md5', 'Ractive', 'chosen' ], function( $, common, sumNote, md5 ){

        var _ = Object.create( common ),
        //modalLabel = [ 'input' ],
        //that.modalName  ='that.modalName ',
        //account_change_pw ='message_account_change_pw',
        //account_setting ='message_account_setting',
            data = {},
            userInfo = _.commonFunc.JsonLStorageGet( 'userInfo' ),
            pageInnerAnswerContent = {},
            constants = _.commonFunc.JsonLStorageGet( 'constant' );

        $( '#cancel-qs-modal').unbind( 'click' ).bind( 'click', function () {
            $( '.navbar_question_modal' ).css( 'display', 'none' );
            $( '.screen_mask' ).css( 'display', 'none' );
        } );

        $( '#cancel-fb-modal').unbind( 'click' ).bind( 'click', function () {
            $( '.navbar_feedback_modal' ).css( 'display', 'none' );
            $( '.screen_mask' ).css( 'display', 'none' );
        } );

        $( '#feedback-Btn').unbind( 'click' ).bind( 'click', function () {
            $( '.navbar_feedback_modal' ).css( 'display', 'block' );
            $( '.screen_mask' ).css( 'display', 'block' );

            modal_feedbackFunc.clean()

        } );

        var modal_questionFunc = {
            modalName : 'navbar_question_modal',
            modalLabel:['input','select','textarea'],
            clean : function () {

                $('#left_account_bonus').text( userInfo.integral )

                $( _.commonFunc.modalAttrLocate( this.modalLabel , this.modalName ) ).each( function(){

                    this.value = ''

                } )

                $('.chosen-select').chosen( 'destroy' ).chosen();

                $( '#submit-qs-modal' ).attr( 'justSubmit', 'true' );

                return;
            },
            sub_question : function  () {
                data = {};
                var that = this,
                    onlySubmit = $( '#submit-qs-modal' ).attr( 'justSubmit' ),
                    innerUrl = '',
                    innerMention = '';

                $( _.commonFunc.modalAttrLocate( this.modalLabel, this.modalName ) ).each( function () {
                    if( this.getAttribute('name') ){
                        data[ this.getAttribute('name') ] = data[ this.getAttribute('name') ] ? data[ this.getAttribute('name') ] : [];
                        var inputData = {};
                        inputData[ this.getAttribute( that.modalName + 'Id' ) ] = this.value
                        data[ this.getAttribute('name') ].push( inputData )
                    }
                    else{
                        this.getAttribute( that.modalName +'Id') ? data[this.getAttribute( that.modalName +'Id')] = $('*['+ that.modalName +'Id = "'+this.getAttribute( that.modalName +'Id')+'"]').val() : ''
                    }
                } )

                data[ 'problemAuthor' ] = userInfo.userName;
                data[ 'userId' ] = userInfo.userId;

                if( data.problemLabel && data.problemLabel.length === 0 ) {
                    myAlert('请填写必要信息')
                    return;
                };

                if( !_.commonFunc.necessaryData( data, '', '' ) ){
                    myAlert('请填写必要信息')
                    return;
                };

                if( data[ 'problemIntegral' ] > userInfo.integral ){
                    myAlert( '积分不足' );
                    return;
                }

                if( onlySubmit == 'true' ){
                    innerUrl = _.commonUrlArray.insertProblemUrl;
                    innerMention = '新增成功';
                }
                else{
                    var returnQuestionD = ( returnListOne && returnListOne( onlySubmit ) );
                    if( data.problemIntegral < returnQuestionD.problemIntegral ) {
                        myAlert( '修改的积分应不小于未修改前的积分' );
                        return false;
                    };
                    innerUrl = _.commonUrlArray.updateProblemUrl;
                    innerMention = '修改成功';
                    data[ 'problemId' ] = onlySubmit;
                }

                _.postAjax( innerUrl, data, function ( data ) {

                    userInfo.integral = data.integral ? data.integral : userInfo.integral;

                    _.commonFunc.JsonLStorageSet( 'userInfo', userInfo );

                    myAlert( innerMention, function () {

                        refreshUserInfo();

                        $( '#cancel-qs-modal').trigger( 'click' );

                        lobbyListConf.toPage = 1;

                        judgeSearch( lobbyListConf );

                    })

                })
            }
        };


        var modal_feedbackFunc = {
            modalName : 'navbar_feedback_modal',
            modalLabel:['input','select','textarea'],
            clean : function () {

                $( _.commonFunc.modalAttrLocate( this.modalLabel , this.modalName ) ).each( function(){

                    this.value = ''

                } )

            },
            sub_feedback : function  () {
                data = {};
                var that = this
                $( _.commonFunc.modalAttrLocate( this.modalLabel, this.modalName ) ).each( function () {
                        if( this.getAttribute('name') ){
                            data[ this.getAttribute('name') ] = data[ this.getAttribute('name') ] ? data[ this.getAttribute('name') ] : [];
                            var inputData = {};
                            inputData[ this.getAttribute( that.modalName + 'Id' ) ] = this.value
                            data[ this.getAttribute('name') ].push( inputData )
                        }
                        else{
                            this.getAttribute( that.modalName +'Id') ? data[this.getAttribute( that.modalName +'Id')] = $('*['+ that.modalName +'Id = "'+this.getAttribute( that.modalName +'Id')+'"]').val() : ''
                        }
                    }
                )

                data[ 'feedbackAuthor' ] = userInfo.userName;
                data[ 'userId' ] = userInfo.userId;

                _.postAjax( _.commonUrlArray.insertFeedbackUrl, data, function ( data ) {

                    myAlert( '提交成功', function () {

                        $( '#cancel-fb-modal').trigger( 'click' )

                    })

                })
            }
        };

        var searchList = {
            tagSearch : function ( key ) {
                var _All_tag = constants.LabelList.slice(),
                    innerDef = $.Deferred();

                function filterTag ( ele ) {
                    if ( ele.labelTitle.indexOf( key ) > -1 ){
                        return ele
                    }
                }

                innerDef.resolve( _All_tag.filter( filterTag).slice( 0, 5 ) );
                return innerDef;
            },
            questionsSearch : function ( key ) {
                var innerDef = $.Deferred(),
                    params = new _.pageInnerConfig();

                if( _.isNull( key ) ){
                    innerDef.resolve( '' );
                    return;
                }

                params.searchData = { "problemStatus" : "", "problemLabel" : [], "userId" : userInfo.userId, title : key }

                params = $.extend( params, params.searchData );
                delete params.searchData;

                _.getAjax( _.commonUrlArray.getProblemAndLabelUrl, params, function( data ){

                    if( data.record.data instanceof Array && data.record.data.length === 0 ){
                        innerDef.resolve( '' );
                    }
                    else{
                        innerDef.resolve( _.dataTransform( data.record.data ) );
                    }

                })

                return innerDef;
            },
            run : function ( key ) {
                var that = searchList;
                $.when( that.questionsSearch( key )/*, that.tagSearch( key )*/ ).done( function( quest/*, tag*/ ) {
                    if( _.isNull( quest ) ){
                        $( '.navbar-abstract-sh-area' ).css( 'display', 'none' );
                        return;
                    }
                    else{
                        $( '.navbar-abstract-sh-area' ).css( 'display', 'block' );
                    }
                    var search_quest = new Ractive({
                        el : 'Ractive-el-quest',
                        template : '#Ractive-temp-quest',
                        data : { quest : quest }
                    });

                    /*                    var search_tag = new Ractive({
                     el : 'Ractive-el-tag',
                     template : '#Ractive-temp-tag',
                     data : { tag : tag }
                     });*/

                })
            }
        };

        message_get();

        //TODO nav获取信息
        function message_get () {
            _.getAjax( _.commonUrlArray.getMessageListUrl, { userId : userInfo.userId, toPage : 1, pageSize : 5 }, function( data ){

                var innerData = _.translateDefaultValue( _.dataTransform( data.record.data ) );

                var message = new Ractive({
                    el : 'Ractive-el-message',
                    template : '#Ractive-temp-message',
                    data : { messages : innerData, counts : data.record.counts }
                });

            })
        };

        $( '#submit-qs-modal' ).unbind( 'click' ).bind( 'click', function () {
            modal_questionFunc.sub_question()
        });

        $( '#submit-fb-modal' ).unbind( 'click' ).bind( 'click', function () {
            modal_feedbackFunc.sub_feedback()
        });

        $( '#ask-Btn' ).unbind( 'click' ).bind( 'click', function () {
            modal_questionFunc.clean();
            $( '.navbar_question_modal' ).css( 'display', 'block' );
            $( '.screen_mask' ).css( 'display', 'block' );
        } );

        $('.lobby_menu').children( 'li' ).unbind( 'click' ).bind( 'click', function () {
            $('.lobby_menu').children( 'li' ).removeClass( 'active' );
            $( this ).removeClass( 'active' ).addClass( 'active' );
        });

        //TODO 搜索问题时触发
        $( '#navSearch').on( 'input', function () {
            if( !this.value ) { $( '.navbar-abstract-sh-area' ).css( 'display', 'none' ); return; };
            searchList.run( this.value );
        });

        var modal_tag_select = new Ractive( {
            el : 'modal_qsTag',
            template : '#modal_qsTag_tpl',
            data : constants
        } );

        $('.chosen-select').chosen();

        //TODO 刷新左侧用户信息
        function refreshUserInfo () {
            $( '.lobby_user_area_name').text( userInfo.userName );
            $( '.lobby_user_area_bonus').text( userInfo.integral );
        };

        refreshUserInfo()




        $('.main_right_content_qs_st_select').children( 'li' ).on( 'click', function () {
            $('.main_right_content_qs_st_select').children( 'li' ).removeClass( 'active' );
            var _show_dom = $( this ).removeClass( 'active' ).addClass( 'active').attr( 'li-seclect' );
            $('.register_division_inputG').css( 'display', 'none' ).find( 'input:not( [ type = "checkbox" ] )' ).val( '' );
            $( '.' + _show_dom).css( 'display', 'block' );
        })

        _.addListeningKeyDown( '.register_division', 13, '#modifyBtn' );

        $( '#modifyBtn').on( 'click', modify_action );

        function modify_action () {
            data = {};
            var what_are = new String();
            $('.main_right_content_qs_st_select').children( 'li').each( function () {
                if ( $( this ).hasClass( 'active' ) ) what_are = $( this ).attr( 'li-seclect' );
            });
            $( _.commonFunc.modalAttrLocate( modalLabel, what_are ) ).each( function () {
                    if( this.getAttribute('name') ){
                        data[ this.getAttribute('name') ] = data[ this.getAttribute('name') ] ? data[ this.getAttribute('name') ] : [];
                        var inputData = {};
                        inputData[ this.getAttribute( what_are + 'Id' ) ] = this.value
                        data[ this.getAttribute('name') ].push( inputData )
                    }
                    else{
                        if( this.getAttribute( what_are+'Id').indexOf('leader') > -1 && $('*['+ what_are+'Id = "'+this.getAttribute( what_are+'Id')+'"]').val() != '' ) compareContent['preferentialPrice'] = { type : Number }
                        this.getAttribute( what_are + 'Id' ) ? data[ this.getAttribute( what_are+'Id')] = $('*['+ what_are+'Id = "'+this.getAttribute( what_are+'Id')+'"]').val() : ''
                    }
                }
            )

            if( !_.commonFunc.necessaryData( data, what_are, '') ){
                myAlert('请填写必要信息')
                return false;
            };

            if( data[ 'userPhone' ] && !_.phoneFormTest( data[ 'userPhone' ] ) ) {
                _.myAlert( '手机格式出错' );
                return false;
            };

            if( data[ 'userEmail' ] && !_.emailFormTest( data[ 'userEmail' ] ) ) {
                _.myAlert( '邮箱格式出错' );
                return false;
            };

            if( data[ 'password' ] && data[ 'password' ] != data[ 'rePassword' ] ) {
                _.myAlert( '确认密码不正确' );
                return false;
            };

            data[ 'password' ] && ( data[ 'password' ] = $.md5( data[ 'password'] ) );
            data[ 'oldPassword' ] && ( data[ 'oldPassword' ] = $.md5( data[ 'oldPassword'] ) );

            data[ 'userId' ] = userInfo.userId

            delete data[ 'rePassword' ]

            _.postAjax( what_are === 'message_account_setting' ?  _.commonUrlArray.updateUserInfoUrl : _.commonUrlArray.updateUserPwdUrl, data, function ( data ) {
                _.myAlert( '修改成功' )
            })

        };

    } )

} )( this )

