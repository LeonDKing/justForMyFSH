/**
 * Created by LeonDKing on 2016/1/3.
 */
define( [ 'lobby' ], function () {

} )


/*
define( [ 'common' ], function ( _ ) {
    var global = this;


    $('.main_right_content_qs_st_select').children( 'li' ).unbind( 'click' ).bind( 'click', function () {
        $('.main_right_content_qs_st_select').children( 'li' ).removeClass( 'active' );
        var _show_dom = $( this ).removeClass( 'active' ).addClass( 'active').attr( 'li-seclect' );
        $('.main_right_content_questionL').css( 'display', 'none' );
        //$( '.' + _show_dom ).css( 'display', 'block' );

        lobbyListConf = new _.pageInnerConfig();
        lobbyListConf.searchData.userId = userInfo.userId;

        lobbyListConf.searchData.problemStatus = _show_dom == 'my_question_doing' ? '进行中' : '已结束';

        judgeSearch( lobbyListConf );

    });

    global.moreQuestions = function  ( it ) {

        var params = $.extend( {},{ pageSize : lobbyListConf.pageSize, toPage : lobbyListConf.toPage + 1 }, lobbyListConf.searchData );

        getDoingAndDoneCounts();

        _.postAjax( _.commonUrlArray.getProblemListUrl, params, function( data ){

            var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

            questionL.data.questionL = questionL.data.questionL.concat( innerDataL );
            questionL.data.counts = data.record.counts;
            questionL.data.toPage++;
            lobbyListConf.toPage++ ;

            questionL.update();

            bindQuestionListFunc()

            bindClickCloseQuest ();


            $('.main_right_content_questionL').css( 'display', 'block' );

            //data.totalSize == 0 ? config.maxPage = 1 : config.maxPage = parseInt( ( ( data.totalSize - 1 ) / data.pageSize ) + 1 );

        })

    }


    function bindClickCloseQuest () {
        $( 'div[close-quest-id]').unbind( 'click' ).bind( 'click', function () {
            var id = this.getAttribute( 'close-quest-id' );
            _.postAjax( _.commonUrlArray.closeProblemUrl, { "problemId" : id, "userId" : userInfo.userId }, function () {
                myAlert( '已关闭该问题', function () {

                    judgeSearch( lobbyListConf );

                } )
            })
        })
    }

    function judgeSearch( config ){
        var params = $.extend( {},{ pageSize : config.pageSize, toPage : config.toPage }, config.searchData );

        getDoingAndDoneCounts();

        _.postAjax( _.commonUrlArray.getProblemListUrl, params, function( data ){

            var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

            questionL = new Ractive({
                el : 'Ractive-el-questionL',
                template : '#Ractive-temp-questionL',
                data : { questionL : innerDataL, toPage : lobbyListConf.toPage, counts : data.record.counts }
            });

            bindQuestionListFunc()

            bindClickCloseQuest ();

            $('.main_right_content_questionL').css( 'display', 'block' );

            _click_piging = false;

            //data.totalSize == 0 ? config.maxPage = 1 : config.maxPage = parseInt( ( ( data.totalSize - 1 ) / data.pageSize ) + 1 );

        })
    }

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

                clickAnswerCollapse( id )

            };
            $( this ).parent( 'div[class="_date_answerC"]' ).next( '._answer_area' ).css( 'display', text == '回答' ?  'block' : 'none');
            $( this ).children( 'a[class="_half_triangle"]' ).css( 'display', text == '回答' ?  'block' : 'none');
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

    function clickAnswerCollapse ( id ) {
        var answerInnerConf = new _.pageInnerConfig();
        answerInnerConf.searchData.problemId = id;
        answerInnerConf.searchData.userId = userInfo.userId;


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

        } )
    }


    global.moreAnswers = function  ( it ) {
        var moreAnswersConf = new _.pageInnerConfig(),
            id = $( it ).parent( 'div._answer_area' ).attr( 'id' ).replace( '_answer_area', '' );
        moreAnswersConf.searchData.problemId = id;
        moreAnswersConf.searchData.userId = userInfo.userId;

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
        $( '._adopt_click').unbind( 'click' ).bind( 'click', function () {
            accessModalFunc._answerId = $( this ).attr( 'adopt_id' );
            accessModalFunc._questId = $( this ).parents( 'div[class="_answer_area"]' ).attr( 'id' ).replace( '_answer_area', '');
            accessModalFunc.clean();
        });

        $( 'div[replay_submit_id]').unbind( 'click' ).bind( 'click', function () {
            var questId = $( this ).parents( 'div[class="_answer_area"]').attr( 'id' ).replace( '_answer_area', '' ),
                answerId = $( this ).attr( 'replay_submit_id' ),
                answererId = $( this ).attr( 'replay_submit_userId' ),
                answererName = $( this ).attr( 'replay_submit_userName' ),
                reply_content = $( this ).prevAll( '.reply_summerNote' ).code();

            _.postAjax( _.commonUrlArray.insertAnswerUrl, { "problemId": questId, "answerContent" : reply_content, "userName": userInfo.userName, "userId": userInfo.userId, "replyName": answererName, "replyId": answererId }, function ( data ) {
                myAlert( '回复成功', function () {
                    clickAnswerCollapse( questId );
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

    lobbyListConf.searchData.problemStatus = '进行中';
    lobbyListConf.searchData.userId = userInfo.userId;
    judgeSearch( lobbyListConf );


    //TODO 回答问题按钮绑定
    bind_replay = function ( it ) {
        var questionId = it.getAttribute( 'replay_quest_id'),
            data = {};
        data[ 'problemId' ] = questionId;
        data[ 'answerContent' ] = $( 'div[replay_quest_content = "' + questionId + '"]').code();
        data[ 'answerer' ] = userInfo.userName;
        data[ 'userId' ] = userInfo.userId;
        data[ 'authorReply' ] = '无';
        data[ 'answerer' ] = userInfo.userName;
        data[ 'answerer' ] = userInfo.userName;

        _.postAjax( _.commonUrlArray.insertAnswerUrl, data, function ( data ) {

            myAlert( '回答成功' );

            judgeSearch( lobbyListConf );

        })
    };

})*/
