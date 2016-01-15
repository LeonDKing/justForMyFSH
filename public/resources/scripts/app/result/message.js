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



        _.getAjax( _.commonUrlArray.getMessageListUrl, params, function( data ){

            var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

            questionL = new Ractive({
                el : 'Ractive-el-questDetial',
                template : '#Ractive-temp-questDetial',
                data : { questionL : innerDataL, toPage : lobbyListConf.toPage, counts : data.record.counts }
            });


            //data.totalSize == 0 ? config.maxPage = 1 : config.maxPage = parseInt( ( ( data.totalSize - 1 ) / data.pageSize ) + 1 );

        })
    };

    var lobbyListConf = new _.pageInnerConfig();

    lobbyListConf.searchData = { "problemStatus" : "", "problemMoney" : '', "userId" : userInfo.userId, problemTime : '', id : problemId };
    lobbyListConf.pageSize = 1;
    judgeSearch( lobbyListConf );


    global.moreQuestions = function  ( it ) {

        var params = $.extend( {},{ pageSize : lobbyListConf.pageSize, toPage : lobbyListConf.toPage + 1 }, lobbyListConf.searchData );

        _.getAjax( _.commonUrlArray.getMessageListUrl, params, function( data ){

            var innerDataL = _.translateDefaultValue( _.dataTransform( data.record.data ) );

            questionL.data.questionL = questionL.data.questionL.concat( innerDataL );
            questionL.data.counts = data.record.counts;
            questionL.data.toPage++;
            lobbyListConf.toPage++ ;

            questionL.update();

            //data.totalSize == 0 ? config.maxPage = 1 : config.maxPage = parseInt( ( ( data.totalSize - 1 ) / data.pageSize ) + 1 );

        })

    }


})