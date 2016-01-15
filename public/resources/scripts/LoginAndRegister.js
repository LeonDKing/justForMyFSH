/**
 * Created by LeonDKing on 2015/12/14.
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
        "common" 	: "fwk/common",
        "md5" 	: "lib/jQuery.md5"
    },
    // 配置依赖,js存在加载先后顺序
    shim : {
        "bootstrap" : {
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

    require( [ 'jquery', 'common', 'md5' ], function( $, common, md5 ){

        var _ = Object.create( common ),
            modalLabel = [ 'input' ],
            loginArea ='loginArea',
            registerArea ='registerArea',
            data = {};

        _.addListeningKeyDown( '.login_division', 13, '#loginBtn' );
        _.addListeningKeyDown( '.register_division', 13, '#registerBtn' );

        $( '#loginBtn').on( 'click', login_action );

        function login_action (){
            data = {};
            $( _.commonFunc.modalAttrLocate( modalLabel, loginArea ) ).each( function () {
                    if( this.getAttribute('name') ){
                        data[ this.getAttribute('name') ] = data[ this.getAttribute('name') ] ? data[ this.getAttribute('name') ] : [];
                        var inputData = {};
                        inputData[ this.getAttribute( loginArea + 'Id' ) ] = this.value
                        data[ this.getAttribute('name') ].push( inputData )
                    }
                    else{
                        if( this.getAttribute( loginArea+'Id').indexOf('leader') > -1 && $('*['+ loginArea+'Id = "'+this.getAttribute( loginArea+'Id')+'"]').val() != '' ) compareContent['preferentialPrice'] = { type : Number }
                        this.getAttribute( loginArea+'Id') ? data[this.getAttribute( loginArea+'Id')] = $('*['+ loginArea+'Id = "'+this.getAttribute( loginArea+'Id')+'"]').val() : ''
                    }
                }
            )

            data[ 'password' ] = $.md5( data[ 'password'] );

            _.postAjax( _.commonUrlArray.userLoginUrl, data, function ( data ) {
                _.commonFunc.JsonLStorageSet( 'userInfo', data.record )
                _.commonFunc.storeConstantFunc( _.commonUrlArray.commonConstantUrl, 'lobby.html' )
            })

        };

        $( '#registerBtn').on( 'click', register_action );

        function register_action () {
            data = {};
            $( _.commonFunc.modalAttrLocate( modalLabel, registerArea ) ).each( function () {
                    if( this.getAttribute('name') ){
                        data[ this.getAttribute('name') ] = data[ this.getAttribute('name') ] ? data[ this.getAttribute('name') ] : [];
                        var inputData = {};
                        inputData[ this.getAttribute( registerArea + 'Id' ) ] = this.value
                        data[ this.getAttribute('name') ].push( inputData )
                    }
                    else{
                        if( this.getAttribute( registerArea+'Id').indexOf('leader') > -1 && $('*['+ registerArea+'Id = "'+this.getAttribute( registerArea+'Id')+'"]').val() != '' ) compareContent['preferentialPrice'] = { type : Number }
                        this.getAttribute( registerArea+'Id') ? data[this.getAttribute( registerArea+'Id')] = $('*['+ registerArea+'Id = "'+this.getAttribute( registerArea+'Id')+'"]').val() : ''
                    }
                }
            )

            if( !_.commonFunc.necessaryData( data, registerArea, '') ){
                myAlert('请填写必要信息')
                return false;
            };

            if( !_.phoneFormTest( data[ 'userPhone' ] ) ) {
                _.myAlert( '手机格式出错' );
                return false;
            };

            if( !_.emailFormTest( data[ 'userEmail' ] ) ) {
                _.myAlert( '邮箱格式出错' );
                return false;
            };

            data[ 'password' ] = $.md5( data[ 'password'] );


            _.postAjax( _.commonUrlArray.insertUserUrl, data, function ( data ) {
                _.myAlert( '注册成功' );
                location.reload();
            })

        };

        $('.loginOrOut_type_select').children( 'li' ).on( 'click', function () {

            $('.loginOrOut_type_select').children( 'li' ).removeClass( 'active' );
            $( this ).removeClass( 'active' ).addClass( 'active' );
            $( '.login_division, .register_division' ).css( 'display', 'none').find( 'input:not([type="checkbox"])').val( '' );
            $( '.' + $( this ).attr( 'show-division' ) ).css( 'display', 'block' );

        });

    } );


} )( this )

