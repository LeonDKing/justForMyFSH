define( [ "permission", "url", "i18n!nls/base"], 
	function( Permission, Url, Lang ) {
	
	var _user = null, _permissionMap = null, _menus = null;

	var Config =  {
		
	};

	// 有待优化 代码啰嗦
	function mixRights( menus ) {
		if( menus && menus.length ) {
			var len = 0, deps = Permission.getDeps();
			if( deps && ( len = deps.length ) ) {
				for( var i = 0; i < len; i++ ) { 
					cycle( menus, deps[i] );
				}
			}
		}
		return menus;
	}

	function cycle( menus, deps ){
		var len = 0, menu, hasChild;
		for( var i = 0, len = menus.length; i < len; i++ ) {
			menu = menus[i];
			hasChild = menu.children && menu.children.length;
			if( hasChild ){
				cycle( menu.children, deps );
			}else {
				if( menu.rsId == deps.rsId ) {
					menu = $.extend( true, menu, deps );
				}
			}
		}
	}

	Config.load = function( callback ) {
		
		var userDeferr = $.ajax( {
			url: Url.getUrl( "user" ),
			dataType: "json"
		} );
		var menusDeffer = $.ajax( {
			url: Url.getUrl( "menus" ),
			dataType: "json"
		} );

		menusDeffer.done( function( data ) {
			if( data.success ) {
				_menus = data.menus;
				_menus = mixRights( _menus );
			}
		} );

		userDeferr.done( function( data ) {
			if( data.success ) {
				_user = data.user;
				_permissionMap = convert2PermissionMap( _user.rights );
				if( _user.task.modifyPwd ) {
					Opf.Toast.info( Lang["checkPwdTips"], Lang["noticeTitle"] );
				}
				
				console.log( "load User info success" );

			} else {
				console.log( "load User info error" );
			}
		} );

		return $.when( userDeferr, menusDeffer ).done( function() {

			callback && callback.apply( null, arguments );

		} ).fail( function() {

			console.log( "get config info error" );

		} );

	};

	Config.drawUser = function( tpl ) {
		if( tpl ) {
			var user = this.getUser();
			var html = tpl( {
				userImg: user.img,
				userNameText: user.name
			} );
			$( ".page-sidebar #side-menu" ).prepend( html );
		} else {
			Opf.toastr.warn( "错误", "获取用户数据失败" );
		}
	};

	Config.getUser = function() {
		return _user;
	};

	Config.getMenus = function() {
		return _menus || [];
	}

	Config.avail = function( rsId, perm ) {
		return Permission.has( rsId, _permissionMap );
	};

	function convert2PermissionMap ( perm ) {
        var ret = {}, code;
        _.each( perm, function ( item ) {
            code = $.trim( item.code );
            code && ( ret[code] = true );
        });
        return ret;
    }

	return Config;

} );