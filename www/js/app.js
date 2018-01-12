angular.module("e_absensi_diskominfo", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","e_absensi_diskominfo.controllers", "e_absensi_diskominfo.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "E-Absensi" ;
		$rootScope.appLogo = "data/images/header/logo_diskominfo_sumatera_utara.png" ;
		$rootScope.appVersion = "1.1" ;
		$rootScope.headerShrink = false ;

		$ionicPlatform.ready(function() {
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/e_absensi_diskominfo/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("61bbb35d-e313-4726-a6b1-4470ed811726").handleNotificationOpened(notificationOpenedCallback).endInit();
			}    


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("e_absensi_diskominfo.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("objLabel", function(){
		return function (obj) {
			var new_item = [];
			angular.forEach(obj, function(child) {
				new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v,l) {
					if (indeks !== 0) {
					new_item.push(l);
				}
				indeks++;
				});
			});
			return new_item;
		}
	})
	.filter("objArray", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks !== 0){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})


.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("id-id");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
}])


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?https10\.114\.110\.10/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?maps\.googleapis\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("e_absensi_diskominfo",{
		url: "/e_absensi_diskominfo",
			abstract: true,
			templateUrl: "templates/e_absensi_diskominfo-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("e_absensi_diskominfo.about_us", {
		url: "/about_us",
		cache:true,
		views: {
			"e_absensi_diskominfo-side_menus" : {
						templateUrl:"templates/e_absensi_diskominfo-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("e_absensi_diskominfo.bantuan", {
		url: "/bantuan",
		cache:true,
		views: {
			"e_absensi_diskominfo-side_menus" : {
						templateUrl:"templates/e_absensi_diskominfo-bantuan.html",
						controller: "bantuanCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("e_absensi_diskominfo.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"e_absensi_diskominfo-side_menus" : {
						templateUrl:"templates/e_absensi_diskominfo-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/e_absensi_diskominfo/dashboard");
});
