/**
 * Created by LeonDKing on 2016/1/3.
 */
define( [ 'common' ], function ( common ) {
    var _ = Object.create( common ),
    //modalLabel = [ 'input' ],
    //that.modalName  ='that.modalName ',
    //account_change_pw ='message_account_change_pw',
    //account_setting ='message_account_setting',
        data = {},
        userInfo = _.commonFunc.JsonLStorageGet( 'userInfo' ),
        pageInnerAnswerContent = {},
        constants = _.commonFunc.JsonLStorageGet( 'constant' );

    var global = this,
        problemId = _.request.QueryString( 'quest_id' );

    function judgeSearch( config ){
        var params = $.extend( {},{ pageSize : config.pageSize, toPage : config.toPage }, config.searchData );


        _.getAjax( _.commonUrlArray.getProblemDetailsUrl, params, function( data ){

            var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

            questionL = new Ractive({
                el : 'Ractive-el-questDetial',
                template : '#Ractive-temp-questDetial',
                data : { questionL : innerDataL, toPage : lobbyListConf.toPage, answerCount : data.record.answerCount }
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
        var _id = $( it ).parents( '.my_answer_area' ).attr( 'access_quest_id' );
        var questionDetail = returnListOne( _id );

        accessModalFunc.lightUpTheStar( questionDetail.problemEvaluate );
        $( '#access_comment' ).text( questionDetail.problemOpinion );

        $( '.access_modal').css( 'display', 'block' );
        $( '.screen_mask').css( 'display', 'block' );

    }

    function clickAnswerCollapse ( id, callback ) {
        var answerInnerConf = new _.pageInnerConfig();
        answerInnerConf.searchData.problemId = id;
        //answerInnerConf.searchData.userId = userInfo.userId;


        var params = $.extend( {},{ pageSize : answerInnerConf.pageSize, toPage : answerInnerConf.toPage }, answerInnerConf.searchData );

        _.postAjax( _.commonUrlArray.getAnswerListUrl, params, function ( data ) {

            var elA = '_answer_area' + id,
                translateData = _.translateDefaultValue( _.dataTransform( data.record.data )),
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

    lobbyListConf.searchData = { "problemStatus" : "", "problemMoney" : '', "userId" : "", problemTime : '', problemId : problemId };
    lobbyListConf.pageSize = 1;
    judgeSearch( lobbyListConf );

    clickAnswerCollapse( problemId )

    //TODO 回答问题按钮绑定
    bind_replay = function ( it ) {
        var questionId = it.getAttribute( 'replay_quest_id'),
            data = {};
        data[ 'problemId' ] = questionId;
        data[ 'answerContent' ] = $( 'div[replay_quest_content = "' + questionId + '"]').code();
        data[ 'userName' ] = userInfo.userName;
        data[ 'userId' ] = userInfo.userId;


        _.postAjax( _.commonUrlArray.insertAnswerUrl, data, function ( data ) {

            myAlert( '回答成功' );

            lobbyListConf.toPage = 1;

            judgeSearch( lobbyListConf );
            clickAnswerCollapse( problemId )
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
                if( $( this).attr( 'lightUp_mun' ) <= num ) $( this).addClass( 'active' );
            });
        }
    }
    // end


})