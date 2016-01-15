/**
 * Created by LeonDKing on 2015/12/16.
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

    require( [ 'jquery', 'common', "summernote-zh-CN", 'Ractive', 'chosen' ], function( $, common, sumNote, Ra ){

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
            modal_questionFunc.clean()
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



        function judgeSearch( config ){
            var params = $.extend( {},{ pageSize : config.pageSize, toPage : config.toPage }, config.searchData );

            ;

            _.postAjax( _.commonUrlArray.getProblemListUrl, params, function( data ){

                var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

                questionL = new Ractive({
                    el : 'Ractive-el-questionL',
                    template : '#Ractive-temp-questionL',
                    data : { questionL : innerDataL, toPage : lobbyListConf.toPage, counts : data.record.counts }
                });

                bindQuestionListFunc()

                $('.main_right_content_questionL').css( 'display', 'block' );

                _click_piging = false;

                //data.totalSize == 0 ? config.maxPage = 1 : config.maxPage = parseInt( ( ( data.totalSize - 1 ) / data.pageSize ) + 1 );

            })
        };

        function bindQuestionListFunc () {

            $('.main_right_content_center > ._reply_area').children( 'p' ).unbind( 'click' ).bind( 'click', function () {
                $( this ).hide();
                $( this ).next( 'div' ).show();
            });

            $( '.main_right_content_center > ._reply_area ._reply_summerNote_cancel' ).unbind( 'click' ).bind( 'click', function () {
                $( this ).parent( 'div' ).hide();
                $( this ).parent( 'div' ).prev( 'p' ).show();
            });

            $( '.main_right_content_center ._date_answerC .only_pointer' ).unbind( 'click' ).bind( 'click', function () {
                if( $( this ).children( 'span:nth-child(2)' ).text() === '0' ) return false;
                var text = $( this ).children( 'span:first-child' ).text(),
                    id = $( this ).children( 'span:first-child' ).attr( 'answer_quest_id');
                $( this ).children( 'span:first-child' ).text( text == '回答' ?  '收起回答' : '回答');
                if( text == '回答' ){
                    var that = this;
                    clickAnswerCollapse( id, function () {
                        $( that ).parent( 'div[class="_date_answerC"]' ).next( '._answer_area' ).css( 'display', 'block' );
                        $( that ).children( 'a[class="_half_triangle"]' ).css( 'display', 'block' );
                    } );

                }
                else{
                    $( this ).parent( 'div[class="_date_answerC"]' ).next( '._answer_area' ).css( 'display', 'none' );
                    $( this ).children( 'a[class="_half_triangle"]' ).css( 'display', 'none' );
                }
                /*
                 $( this ).parent( 'div[class="_date_answerC"]' ).next( '._answer_area' ).css( 'display', text == '回答' ?  'block' : 'none');
                 $( this ).children( 'a[class="_half_triangle"]' ).css( 'display', text == '回答' ?  'block' : 'none');
                 */
            });

            $( '.reply_summerNote' ).summernote( { lang : 'zh-CN' , focus : true } );

            return;
        }

        function returnListOne ( id ) {
            for( var i in questionL.data.questionL ){
                if( questionL.data.questionL[i].id == id ){
                    return questionL.data.questionL[i]
                }
            }
            return false;
        }

        function getAnswersProblemStatus ( id ) {
            return $( '#_answer_area' + id ).attr( 'answer_quest_status' )
        }

        global.check_accessFunc = function  ( it ) {
            var _id = $( it ).parents( '._answer_area' ).attr( 'access_quest_id' );
            var questionDetail = returnListOne( _id );


            console.log( questionDetail )

            accessModalFunc.lightUpTheStar( questionDetail.problemEvaluate );
            $( '#access_comment' ).text( questionDetail.problemOpinion );

            $( '.access_modal').css( 'display', 'block' );
            $( '.screen_mask').css( 'display', 'block' );

        }

        $( '.cross_closs').unbind( 'click' ).bind( 'click', function () {
            $( '.access_modal' ).css( 'display', 'none' );
            $( '.screen_mask' ).css( 'display', 'none' );
        });

        function clickAnswerCollapse ( id, callback ) {
            var answerInnerConf = new _.pageInnerConfig();
            answerInnerConf.searchData.problemId = id;
            //answerInnerConf.searchData.userId = userInfo.userId;


            var params = $.extend( {},{ pageSize : answerInnerConf.pageSize, toPage : answerInnerConf.toPage }, answerInnerConf.searchData );

            _.postAjax( _.commonUrlArray.getAnswerListUrl, params, function ( data ) {

                var elA = '_answer_area' + id,
                    translateData = _.translateDefaultValue( _.dataTransform( data.record.data ) ),
                    status = getAnswersProblemStatus( id );

                for( var s in translateData ){
                    translateData[s][ 'answersProblemStatus' ] = status
                }

                answerL = new Ractive({
                    el : elA,
                    template : '#Ractive-temp-answer_reply',
                    data : { answerDate : translateData, counts : data.record.counts }
                });

                var innerDataL = questionL.data.questionL;

                for( var i in  innerDataL ){
                    innerDataL[i].id == id ? innerDataL[i].unCheckCount = data.record.unCheckCount : '';
                };

                pageInnerAnswerContent[ id ] = translateData;

                questionL.update()

                bindQuestionListFunc()

                answerReplyAreaBindFunc()

                callback && callback();

            } )
        }

        global.moreQuestions = function  ( it ) {

            var params = $.extend( {},{ pageSize : lobbyListConf.pageSize, toPage : lobbyListConf.toPage + 1 }, lobbyListConf.searchData );

            _.postAjax( _.commonUrlArray.getProblemListUrl, params, function( data ){

                var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

                questionL.data.questionL = questionL.data.questionL.concat( innerDataL );
                questionL.data.counts = data.record.counts;
                questionL.data.toPage++;
                lobbyListConf.toPage++ ;

                questionL.update();

                bindQuestionListFunc()


                $('.main_right_content_questionL').css( 'display', 'block' );

                //data.totalSize == 0 ? config.maxPage = 1 : config.maxPage = parseInt( ( ( data.totalSize - 1 ) / data.pageSize ) + 1 );

            })

        }


        global.moreAnswers = function  ( it ) {
            var moreAnswersConf = new _.pageInnerConfig(),
                id = $( it ).parent( 'div._answer_area' ).attr( 'id' ).replace( '_answer_area', '' );
            moreAnswersConf.searchData.problemId = id;
            //moreAnswersConf.searchData.userId = userInfo.userId;

            var params = $.extend( {},{ pageSize : 10000000, toPage : moreAnswersConf.toPage }, moreAnswersConf.searchData );

            _.postAjax( _.commonUrlArray.getAnswerListUrl, params, function ( data ) {

                var elA = '_answer_area' + id,
                    translateData = _.translateDefaultValue( _.dataTransform( data.record.data )),
                    status = getAnswersProblemStatus( id );


                for( var s in translateData ){
                    translateData[s][ 'answersProblemStatus' ] = status
                }

                new Ractive({
                    el : elA,
                    template : '#Ractive-temp-answer_reply',
                    data : { answerDate : translateData, counts : 0 }
                });

                for( var i in  innerDataL ){
                    innerDataL[i].id == id ? innerDataL[i].unCheckCount = data.record.unCheckCount : '';
                };

                pageInnerAnswerContent[ id ] = translateData;

                questionL.update()

                answerReplyAreaBindFunc()

            } )

        }

        function answerReplyAreaBindFunc () {

            $( 'div[replay_submit_id]').unbind( 'click' ).bind( 'click', function () {
                var questId = $( this ).parents( 'div[class="_answer_area"]').attr( 'id' ).replace( '_answer_area', '' ),
                    answerId = $( this ).attr( 'replay_submit_id' ),
                    answererId = $( this ).attr( 'replay_submit_userId' ),
                    answererName = $( this ).attr( 'replay_submit_userName' ),
                    reply_content = $( this ).prevAll( '.reply_summerNote' ).code();

                _.postAjax( _.commonUrlArray.insertAnswerUrl, { "problemId": questId, "answerContent" : reply_content, "userName": userInfo.userName, "userId": userInfo.userId, "replyName": answererName, "replyId": answererId }, function ( data ) {
                    myAlert( '回复成功', function () {
                        clickAnswerCollapse( questId );
                        //TODO 更新最新回答数
                        $( 'span[answer_quest_id="' + questId + '"]').next( 'span._anserC' ).text( data.AnswerCount );
                        //end
                    })
                } )
            });

            $( '.reply_summerNote' ).summernote( { lang : 'zh-CN' , focus : true } );

            $( '.main_right_content_center ._answer_area ._answers .only_pointer, .main_right_content_center ._answer_area ._answers ._reply_summerNote_cancel' ).unbind( 'click' ).bind( 'click', function () {
                var _active_target = $( this ).parents( '._right' ).children( '._reply_area' ),
                    _answer_reply_active = _active_target.hasClass( 'active' );
                _answer_reply_active ? _active_target.removeClass( 'active' ) : _active_target.addClass( 'active' );
            });
            return;
        }


        var lobbyListConf = new _.pageInnerConfig();

        var quest_title = _.request.QueryString( 'quest_title' );

        lobbyListConf.searchData = { "problemStatus" : "", "problemMoney" : '', "userId" : "", problemTime : '' };
        if( quest_title ) lobbyListConf.searchData[ "problemTitle" ] = quest_title;

        judgeSearch( lobbyListConf );


        //TODO 回答问题按钮绑定
        bind_replay = function ( it ) {
            var questionId = it.getAttribute( 'replay_quest_id'),
                data = {};
            data[ 'problemId' ] = questionId;
            data[ 'answerContent' ] = $( 'div[replay_quest_content = "' + questionId + '"]').code();
            data[ 'userId' ] = userInfo.userId;
            data[ 'userName' ] = userInfo.userName;

            _.postAjax( _.commonUrlArray.insertAnswerUrl, data, function ( data ) {

                myAlert( '回答成功' );

                lobbyListConf.toPage = 1;

                judgeSearch( lobbyListConf );

            })
        };


        //TODO 评估modal start
        var accessModalFunc = {
            _questId : '',
            _answerId : '',
            clean : function () {
                $( '.access_star' ).removeClass( 'active' );
                $( 'textarea[access_modalId="comment"]' ).val( '' );
                $( '.access_modal' ).css( 'display', 'block' );
                $( '.screen_mask' ).css( 'display', 'block' );
            },
            sub_access : function () {
                var starCounts = $( '.access_star.active' ).length,
                    access_comment = $( 'textarea[access_modalId="comment"]' ).val();

                if( !starCounts ){
                    myAlert( '请选择评价星级' );
                    return;
                }

                if( _.isNull( access_comment ) ){
                    myAlert( '请输入评价' );
                    return;
                }

                _.postAjax( _.commonUrlArray.updateProblemStatusUrl, { "answerId" : this._answerId , "problemId" : this._questId }, function ( data ) {
                    myAlert( '采纳成功', function () {
                        $( '#cancel-as-modal').trigger( 'click' );
                        judgeSearch( lobbyListConf );
                    })
                } )
            },
            lightUpTheStar : function ( num ) {
                $( '.access_star').removeClass( 'active' ).each( function (){
                    if( $( this ).attr( 'lightUp_mun' ) <= num ) $( this ).addClass( 'active' );
                });
            }
        }
        // end

        //TODO 问题列表筛选
        $( '.main_right_content_titlebar ._filter').on( 'click', function () {
            $( '.main_right_content_titlebar ._filter').removeClass( 'active' )
            var all = $( this ).addClass( 'active').children( 'span' ).hasClass( 'noFilter' );
            if( all ){
                filterCleanAllArrow()
                judgeSearch( lobbyListConf );
            };
        });

        function filterCleanAllArrow () {
            $( '.main_right_content_titlebar ._filter_arrow').removeClass( '_up' ).removeClass( '_down' );
            lobbyListConf.searchData.problemMoney = '';
            lobbyListConf.searchData.problemIntegral = '';
            return;
        };

        $( '.main_right_content_titlebar ._filter_arrow').on( 'click', function () {
            var upOrDown;
            if( !$( this ).hasClass( '_up' ) && !$( this ).hasClass( '_down' ) || $( this ).hasClass( '_down' )  ) upOrDown = 'up'
            else if( $( this ).hasClass( '_up' ) ) upOrDown = 'down';

            filterCleanAllArrow()

            var questL_array_btn = $( this ).addClass( '_' + upOrDown).parent( 'li' ).attr( 'questL_array_btn' )

            lobbyListConf.searchData[ questL_array_btn ] = upOrDown == 'up' ? 1 : 2;

            judgeSearch( lobbyListConf );

        });


        $( '.main_right_content_titlebar ._filter_check input').on( 'click', function () {

            lobbyListConf.searchData.problemStatus = this.checked == true ? '进行中' : '';

            judgeSearch( lobbyListConf );
        });
    } );


} )( this )