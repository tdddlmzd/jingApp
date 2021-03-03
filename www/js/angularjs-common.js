var app = angular.module('starter.controllers', ['ngResource', 'ngCookies', 'pascalprecht.translate', 'ionic-datepicker', 'chart.js', 'ngCordova'])
    //杨卿林 20200303 利用angularjs $translateProvider 实现多语言
app.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en', {
        //-----------------------手机船期---------------------
        'sjcq_cq': 'Schedule',
        'sjcq_gz': 'Tracking',
        'sjcq_wd': 'Me',
        'sjcq_qxzqyg': 'City,Port',
        'sjcq_qxzmdg': 'City,Port',
        'sjcq_qis' : 'startPort',
        'sjcq_mud' : 'endPort',
        'sjcq_riq' : 'Time',
        'sjcq_lg': 'ETD',
        'sjcq_dg': 'ETA',
        'sjcq_cx': 'Search',
        'sjcq_history': 'history Record',
        'sjcq_etd': 'ETD',
        'sjcq_bz': 'This Week',
        'sjcq_xyz': 'Next One',
        'sjcq_xerz': 'Next Two',
        'sjcq_xsz': 'Next Three',
        'sjcq_zd': 'Dir',
        'sjcq_zz': 'Transit',
        'sjcq_zyzezszszwzlzr': 'Mon Tue Wed Thu Fri Sat Sun ',
        'sjcq_jbc': 'Temporary',
        'sjcq_tcdc': 'First Vessel',
        'sjcq_bc': 'Barge',
        'sjcq_tl': 'Rail',
        'sjcq_tc': 'Truck',
        'sjcq_yc': 'Delay',
        'sjcq_th': 'Stop',
        'sjcq_tg': 'Jump',
        'sjcq_tq': 'Advance',


        'sjcq_zhund': 'OnTime',
        'sjcq_yanw': 'Delay',
        'sjcq_tq': 'Advance',
        'sjcq_th': 'Stop',
        'sjcq_tg': 'Jump',
        'sjcq_cmdd': 'vessel determined',
        'sjcq_stop': 'Stop',

        'sjcq_jh': 'Plan',
        'sjcq_gcc': 'Share carrier',
        'sjcq_cwfk': 'Error',
        'sjcq_ljgz': 'Track',
        'sjcq_ygz': 'Have Track',
        'sjcq_cm': 'Vessel',
        'sjcq_cc': 'Voyage',
        'sjcq_hxdm': 'RouteCode',
        'sjcq_tjgk': 'Docking Port',
        'sjcq_mtcz': 'POL Deadlines',
        'sjcq_kgsj': 'CY Open',
        'sjcq_jgangsj': 'CY Close',
        'sjcq_jdsj': 'SI/VGM',
        'sjcq_jguansj': 'CY',
        'sjcq_jhkb': 'ETA',
        'sjcq_sjkb': 'ATA',
        'sjcq_jhlb': 'ETD',
        'sjcq_sjlb': 'ATD',
        'sjcq_zdl': 'Punctual Rate',
        'sjcq_zdfx': 'Punctual Rate',
        'sjcq_zdfx': 'Punctual Rate',
        'sjcq_jzz': 'Loading...',
        'sjcq_qsrqsg': 'Please enter the starting port',
        'sjcq_qsrmdg': 'Please enter port of destination',
        'sjcq_td': 'day to',
        'sjcq_t': 'day',
        'sjcq_czcc': 'Operation Succeeds',
        'sjcq_czsb': 'Operation Failure',
        'sjcq_fwgd': 'Too many unlogged visits, please log in',
        'sjcq_ykcx': 'Visitors can only check 3 times a day, please login to continue using',
        'sjcq_jhlg': 'ETD',
        'sjcq_jhdg': 'ETA',
        'sjcqc_jbc': 'Extra Ship',
        'sjcq_Mon': 'Mon',
        'sjcq_Tue': 'Tue',
        'sjcq_Wed': 'Wed',
        'sjcq_Thu': 'Thu',
        'sjcq_Fri': 'Fri',
        'sjcq_Sat': 'Sat',
        'sjcq_Sun': 'Sun',
        'sjcq_zwsj': 'No Data',
        'sjcq_zwgk': 'No Port',
        'sjcq_zwcgs': 'No Company',
        'sjcq_mqzusj': 'There is no data at present',
        'sjcq_ckwzlj': 'View the full path',
        'sjcq_sqlwz': 'close',
        //-----------------------手机跟踪---------------------
        'sjgz_wdgz': 'My Tracking',
        'sjgz_ksty': "Let's get started!",
        'sjgz_gzcbhxhssdt_top': 'You can track ship and container cargo throughout the entire node',
        'sjgz_gzcbhxhssdt_bottom': 'and obtain real- time dynamic reminder !',
        'sjgz_tjgz': 'Add Tracking',
        'sjgz_xhgz': 'Container Tracking',
        'sjgz_sl': '',
        'sjgz_cbgz': 'Ship Tracking',
        'sjgz_cbgzsl': '',
        'sjgz_gjtstbqbxhhcb': 'Distinguish ship and container tracking according to icons',

        'sjgz_xh': 'Container',
        'sjgz_cb': 'Ship',
        'sjgz_tdhdchxhy': 'BL/Booking',
        'sjgz_ptdhdchxhy': 'Please Enter BL/Booking',
        'sjgz_xzcgs': 'Select Carrier',
        'sjgz_gz': 'Tracking',

        'sjgz_tjqb': 'All',
        'sjgz_lgq': 'Departure',
        'sjgz_zt': 'Process',
        'sjgz_dg': 'Discharged',
        'sjgz_wc': 'Completed',
        'sjgz_yc': 'Error',
        'sjgz_cx': 'searchQuery',
        'sjgz_axzr': 'Record Date',
        'sjgz_algr': 'Departure Date',
        'sjgz_tkx': 'Pick Up',
        'sjgz_jg': 'Gate In',
        'sjgz_hf': 'Custom Release',
        'sjgz_mf': 'Terminal Release',
        'sjgz_zc': 'Loaded',
        'sjgz_lg': 'Sailing',
        'sjgz_dg': 'Discharged',
        'sjgz_th': 'Consignee',
        'sjgz_hk': 'Return',
        'sjgz_tl': 'RAIL',
        'sjgz_tl_Boxing': 'RailwayBoxing', // IRLB
        'sjgz_tl_Departure': 'RailwayDeparture', // IRDP
        'sjgz_tl_unloadBox': 'RailunloadBox', // IRDS
        'sjgz_tl_arrivals' :'arrivals', //IRAR

        'sjgz_tjcwfk': 'Error Feedback',
        'sjgz_sjtx': 'Phone Remind',
        'sjgz_ytx': 'Reminded',
        'sjgz_qxtx': 'Cancel reminder',
        'sjgz_lrdh': 'Enter Number',
        'sjgz_qsrdh': 'BL/Booking/Container',
        'sjgz_qx': 'Cancel',
        'sjgz_qd': 'OK',

        //-----------------------手机其他页---------------------
        'sjqty_gkss': 'Search Port',
        'sjqty_qxzgk': 'Port/City',
        'sjqty_tjgk': 'Hot Ports',
        'sjqty_cgsss': 'Search Carrier',
        'sjqty_qxzcgs': 'Carrier Code',
        'sjqty_tjcgs': 'Hot Carriers',
        'sjqty_language': '中文',
        'sjqty_english': 'English',

        'sjqty_zxkf': 'Customer Service',
        'sjqty_yy': 'Language',
        'sjqty_gy': 'About',
        'sjqty_fwxy': 'Service agreement',
        'sjqty_ysxy': 'Privacy agreement',
        'sjqty_bbh': 'Version',
        'sjqty_grxx': 'Personal Information',
        'sjqty_tx': 'Profile Photo',
        'sjqty_nc': 'Name',
        'sjqty_xb': 'Sex',
        'sjqty_zw': 'Position',
        'sjqty_ssgs': 'Company',
        'sjqty_sj': 'Mobile Phone',
        'sjqty_zj': 'Office Phone',
        'sjqty_yx': 'Email',
        'sjqty_tcdl': 'Sign Out',


        //-----------------------船期---------------------
        'cq_cq': 'SCHEDULE',
        'cq_gz': 'TRACKING',
        'cq_api': 'API',
        'cq_xz': 'DOWNLOAD',
        'cq_dl': 'Login',
        'cq_mfsy': 'Get Started',
        'cq_jzsjrhdgzy': 'Makes freight forwarding more professional!',
        'cq_qxzqyg': 'CTIY,PORT',
        'cq_qsrmdgzwyw': 'CITY, PORT',
        'cq_lg': 'ETD',
        'cq_dg': 'ETA',
        'cq_cx': 'SEARCH',
        'cq_cq': 'Schedule',
        'cq_gcmc': 'Common Cabin/Operator',
        'cq_lszdl': 'Historical Punctuality',
        'cq_jbctx': 'Temporary',
        'cq_tgthywyj': 'Port jump / stop / delay',
        'cq_cbgz': 'Ship Tracking',
        'cq_wl30tgkjh': 'The next 30 days docking plan',
        'cq_gq7thxgj': 'Past 7 days trajectory',
        'cq_dqwz': 'Current Position',
        'cq_cbda': 'Ship File',
        'cq_xhgz': 'Container Tracking',
        'cq_ctxdmddhxqcgz': 'Full name tracking from pick- up to ',
        'cq_jgjdkjgtx': 'CY Cutoff, SI Cutoff , VGM Cutoff, CY Open, CY Close',
        'cq_mtcbjhtx': 'Terminal ship plan',
        'cq_sxjyyj': 'Dumping / Checking',
        'cq_zzgxzzlyj': 'Transit Port Overstay Period',
        'cq_xzjz': 'Download',
        'cq_Windowsdnd': 'Windows',
        'cq_wxgzh': 'WeChat',

        'cq_lgr': 'ETD',
        'cq_dgr': 'ETA',
        'cq_cx': 'SEARCH',
        'cq_bz': 'This Week',
        'cq_xyz': 'Next Week',
        'cq_xerz': 'Next Two Weeks',
        'cq_xsz': 'Next Three Weeks',
        'cq_yXXXXfwXXXXgyXzzhfw,Xzzzfw': 'From XXXX to XXXX, there are X direct and X transit services',
        'cq_dbmc': 'Operator',
        'cq_dblsgc': 'Temporary',
        'cq_dbbzbjh': "Don't Pick Up",
        'cq_jzsx': 'Screening',
        'cq_zd': 'Dir',
        'cq_zz': 'Trans',
        'cq_sj': 'Time',
        'cq_yesswlr': 'Mon Tue Wed Thu Fri Sat Sun ',
        'cq_cgs': 'Carrier',
        'cq_qb': 'All',
        'cq_mt': 'Terminal',
        'cq_qyg': 'POL',
        'cq_mdg': 'POD',
        'cq_qb': 'All',
        'cq_qktj': 'Clear Conditions',
        'cq_cqfa': 'Schedule',
        'cq_hc': 'TT',
        'cq_tcdcdt': 'Headway Big Ship News',
        'cq_cz': 'Details',
        'cq_zyzezszszwzlzr': 'Mon Tue Wed Thu Fri Sat Sun',
        'cq_cm': 'Vessel',
        'cq_hc': 'Voyage',
        'cq_xq': 'Details',
        'cq_gdzzfa': 'More Transit Options',
        'cq_bc': 'Barge',
        'cq_tl': 'Rail',
        'cq_tc': 'Truk',
        'cq_yc': 'Delay',
        'cq_th': 'Stop',
        'cq_tg': 'Jump',
        'cq_jbc': 'Temporary',
        'cq_qqcqmzsm': 'Ship Schedule Disclaimer:Whale Calling Data provides global schedule related information, including but not limited to vessel, voyage, route code, shared class, departure and arrival date, and port ship planning information, including: docking, opening / closing date, actual berthing , Actual departure time, etc. Sourced from data released by major shipping companies, terminals and related departments around the world. Due to changes in information and network transmission problems, such information provided by Whale Calling Data may not be up-to-date or inaccurate, so it is for reference only, and no company or individual can take this as any promise made by Whale Calling Data.',

        'cq_jh': 'PlAN',
        'cq_cwfk': 'Error Feedback',
        'cq_ljgz': 'Track Now',
        'cq_ckwzfa': 'Show Details',
        'cq_sq': 'Hide Details',
        'cq_jzrq': 'Built',
        'cq_zxl': 'Volume',
        'cq_yyf': 'Operator',
        'cq_tjgk': 'Docking Port',
        'cq_jhlg': 'ETD',
        'cq_sjlg': 'ATD',
        'cq_jhdg': 'ETA',
        'cq_sjdg': 'ATA',
        'cq_zysj': 'POL Deadlines',
        'cq_kgsj': 'CY Open',
        'cq_jgsj': 'CY Close',
        'cq_jdsj': 'SI/ VGM',
        'cq_jgsj': 'CY',
        'cq_jhkb': 'ETA',
        'cq_sjkb': 'ATA',
        'cq_jhlb': 'ETD',
        'cq_sjlb': 'ATD',
        'cq_hxzdl': 'Punctual Rate',
        'cq_qygzdl': 'POL Punctuality',
        'cq_mdgzdl': 'POD Punctuality',
        'cq_xcqyg': 'Advance Notice',
        'cq_qxzqyg': 'Please select POL',
        'cq_qxzmdg': 'Please select POD',

        //-----------------------跟踪---------------------
        'gz_srdchtdhxh': 'Booking number/Bill of lading/Container number',
        'gz_xzcgs': 'Carrier',
        'gz_gz': 'Track',
        'gz_qb': 'All',
        'gz_wsj': 'Error',
        'gz_tkx': 'Pick Up',
        'gz_jg': 'Gate In',
        'gz_hf': 'Custom Release',
        'gz_mf': 'Terminal Release',
        'gz_zc': 'Loaded',
        'gz_lg': 'Sailing',
        'gz_dg': 'Discharged',
        'gz_th': 'Consignee',
        'gz_hk': 'Return',
        'gz_ssydnr': '',
        'gz_mrpx': 'Default',
        'gz_akhr': 'Sailing Day',
        'gz_axzr': 'Record Date',
        'gz_agxr': 'Update Date',
        'gz_qx': 'Select All',
        'gz_sjtx': 'Phone Remind',
        'gz_plsc': 'Deletion',
        'gz_kg': 'CY Open',
        'gz_jg': 'CY Close',
        'gz_jd': 'CY Cutoff',
        'gz_tx': 'Remind',
        'gz_ytx': 'Reminded',
        'gz_ldh': 'Record Number',
        'gz_qlrdchtdhxh': 'Booking Number/Bill of Lading',
        'gz_qx': 'Cancel',
        'gz_qd': 'Determine',
        'gz_lbz': 'Notes',
        'gz_qlrgydhdbzxx': 'Enter Notes',
        'gz_srtdhgzcjd': 'Visualization of the whole process of shipment',
        'gz_bqmyztgzxx': '(*> ﹏ <*) Sorry! No Tracking Information',
        'gz_xhgzmzsm': '"Container Tracking Disclaimer:Whale Calling Data provides container tracking information, including emptying, packing, entering the port, customs clearance, terminal release, loading, departure, arrival transit port, transfer unloading, transfer on board, transit departure, arrival, Nodes for unloading, picking up, returning empty containers, etc.; also provide terminal ship plan, port closing time, order closing time, etc.Sourced from data released by major shipping companies, terminals and related departments around the world.Due to changes in information and network transmission problems, such information provided by Whale Calling Data may not be up- to - date or inaccurate, so it is for reference only, and no company or individual can take this as any promise made by Whale Calling Data. """',
        'gz_sjhzhqz': 'The data is still being retrieved',
        'gz_wuygq': 'B/L is invalid or expired.Please check later',
        'gz_j': 'Pieces',
        'gz_z': 'Weight',
        'gz_t': 'Volume',
        'gz_cwfk': 'Error Feedback',
        'gz_sjtx': 'Phone Remind',
        'sjgz_t': 'Day',
        'gz_qxzqyg': 'Please select POL',
        'gz_qxzmdg': 'Please select POD',
        'gz_qxtxcnsc': 'Cancel before deleting',
        'gz_sccg': 'Delete the success',

        'gz_qsrgzdh': 'Please enter the tracking number',
        'gz_qxzcgs': 'Please select carrier',
        'sjgz_qxdl': 'Please login first',




        //-----------------------API---------------------
        'api_jzapifw': 'Whale Calling DATA API Service',
        'api_jzffdapifw,fbnkjgjzjdznhhy': 'Make it easy for you to build your own intelligent shipping!',
        'api_zxsq': 'Online Consultation',
        'api_cqsj': 'Ship Schedule',
        'api_xhgz': 'Container Tracking',
        'api_dtsksh': 'Map Visualization',
        'api_hxcq': 'Route Schedule',
        'api_aqygmdgcxcqsj': 'Query schedule data by port of departure and port of destination',
        'api_cbcq': 'Vessel Schedule',
        'api_acmcxgcbdhxcqhgkgxx': 'Query the route schedule and port of call of this ship by ship name',
        'api_lszdl': 'Historical Punctuality',
        'api_aqygmdghxdmcx': 'Press the port of departure, port of destination, and route code to check the punctuality rate for the past 90 days.',
        'api_xhgz': 'Container Tracking',
        'api_mtcbjh': 'Terminal Ship Plan',
        'api_atdhxh': 'Check the planned berth, actual berth, planned berth, actual berth by ship number / box number',
        'api_mtxhgz': 'Terminal Container Tracking',
        'api_atdhxhcx': 'Press the bill of lading number / box number to inquire about port entry, customs release, terminal release, loading',
        'api_cgsxhgz': 'Carrier Container Tracking',
        'api_atdhxhcxtkx': 'Search for empty container, arrival, embarkation, departure, arrival, unloading, pickup, return of empty container',
        'api_dtsxhgz': 'Map Visualization',
        'api_atdhxhcxyddcqgh': 'According to the bill of lading, container number, query the shipping schedule of shipment, the current position of the ship, the form trajectory of the past 7 days, the destination port ETA and the remaining voyage.',
        'api_jzfnmygwlrwxxt': 'WCD empowers every logistics person with unlimited collaboration and unlimited ability to create!',
        'api_zxzx': 'Online Consultation',

        //-----------------------登录&注册---------------------
        'dlzc_gxtywmdcphyzc': 'Thanks for trying our products, welcome to register!',
        'dlzc_sjhm': 'Phone Number',
        'dlzc_qsrndsjhm': 'Please enter your phone number',
        'dlzc_yzm': 'Verification Code',
        'dlzc_yzmyfsz': 'Verification code has been sent to',
        'dlzc_qsryzm': 'Please enter verification code',
        'dlzc_fsyzm': 'Send the verification code',
        'dlzc_mm': 'Password',
        'dlzc_cxhq': 'Second to retrieve',
        'dlzc_hqyzm': 'get code',
        'dlzc_qsrmm': 'Please enter the password',
        'dlzc_yqm': 'Invitation Code',
        'dlzc_qsryqm': 'Please enter an invitation code',
        'dlzc_wczcjdbnty': 'By completing the registration, you agree',
        'dlzc_jjyhxy': 'Whale Calling User Registration Agreement',
        'dlzc_wczc': 'Complete Registration',
        'dlzc_yzhzjdl': 'Have an account? Direct Login',
        'dlzc_sjyzmdl': 'Mobile phone verification code login',
        'dlzc_yzmdl': 'verification code login',
        'dlzc_gxtywmdcphydl': 'Thanks for trying our products, welcome to login!',
        'dlzc_jzw': 'Remember me',
        'dlzc_dl': 'LOGIN',
        'dlzc_wjmm': 'Forget password',

        'dlzc_hmyzh': 'No account？',
        'dlzc_ljzc': 'Register immediately',

        'dlzc_wsxx': 'Perfect information',
        'dlzc_qdlzhhmm': 'Please enter your account number and password',
        'dlzc_srndsjh': ' Enter your mobile phone number and we will send a verification code to your phone to help you recover your password',
        'dlzc_tj': 'SUBMIT',
        'dlzc_czmm': 'Reset Passwords',
        'dlzc_xmm': 'New Passwords',
        'dlzc_sexnr': 'Man',
        'dlzc_sexvr': 'Woman',
        'dlzc_yzyldmm': 'Verify your original password to change the password',
        'dlzc_ymm': 'Original Password',
        'dlzc_qsrymm': 'Please enter the original password',
        'dlzc_mm': 'Password',
        'dlzc_qsrmm': 'Please enter the password',
        'dlzc_qrmm': 'Confirm password',
        'dlzc_qqrmm': 'Please confirm your password',
        'dlzc_bc': 'SAVE',
        'dlzc_yjzcgl': 'Already registered, ',
        'dlzc_ljdl': 'Login immediately',
        'dlzc_zhsz': 'Account Settings',
        'dlzc_tcdl': 'Sign Out',
        'dlzc_ndyqm': 'Your invitation code',
        'dlzc_jbxx': 'Basic Information',
        'dlzc_grxx': 'Personal Information',
        'dlzc_yhm': 'User Name',
        'dlzc_qsryhm': 'Please enter user name',
        'dlzc_sjhm': 'Mobile Phone',
        'dlzc_qsrsjhm': 'Please enter the mobile phone',
        'dlzc_yxdz': 'Email',
        'dlzc_qsryxdz': 'Please input the email address',
        'dlzc_mm': 'Password',
        'dlzc_qsrmm': 'Please enter the password',
        'dlzc_rgnxxgmmqdjzl': 'Click here if you want to change your password',
        'dlzc_gsxx': 'Company Information',
        'dlzc_wrz': 'Not Certified',
        'dlzc_yrz': 'Verified',
        'dlzc_zsxm': 'Real- name',
        'dlzc_qsrzsxm': 'Please enter your nickname',
        'dlzc_gszw': 'Position in company',
        'dlzc_qsrgszw': 'Please enter the position',
        'dlzc_gsmc': 'Company Name',
        'dlzc_qsrgsmc': 'Please enter the name of the business',
        'dlzc_bgdh': 'Office Phone',
        'dlzc_qsrbgdh': 'Please enter the office phone',
        'dlzc_gswz': 'Company Website',
        'dlzc_qsrgswz': 'Please enter company URL',
        'dlzc_gsdz': 'Company Address',
        'dlzc_qsrgsdz': 'Please enter company address',
        'dlzc_ywys': 'Business Advantage',
        'dlzc_qsrywys': 'Please enter a business advantage',
        'dlzc_sjxx': 'Social information',
        'dlzc_qq': ' QQ',
        'dlzc_qsrqq': 'Please enter QQ',
        'dlzc_wx': 'Wechat',
        'dlzc_qsrwx': 'Please enter Wechat',
        'dlzc_wb': 'Weibo',
        'dlzc_qsrwb': 'Please enter Weibo',
        'dlzc_skype': 'Skype',
        'dlzc_qsrskype': 'Skype	Please enter Skype',
        'dlzc_facebook': 'Facebook',
        'dlzc_qsrfacebook': 'Please enter Facebook',
        'dlzc_twitter': 'Twitter',
        'dlzc_qsrtwitter': 'Please enter Twitter',
        'dlzc_bc': 'SAVE',
        'dlzc_smrz': 'Verified',
        'dlzc_smrzxx': 'Real- name certification: your privileged ID card; through your real-name business, you can get an additional 60 member use period',
        'dlzc_qscndxx': 'Please upload a scanned copy of your business card or work tag or business license, and we will get in touch with you within one business day to complete the review.',
        'dlzc_zzgs': 'Support GIF / JPEG / PNG / BMP format, maximum support 4M',
        'dlzc_djsctp': 'Upload Picture',
        'dlzc_tjsmrz': 'SUBMIT',
        'dlzc_zc': 'Register',
        'dlzc_zhhmmcw': 'Not correct login or password',
        'dlzc_yzmsrcwhdhsr': 'Not correct verification code',
        'dlzc_yqmcwhdhsr': 'Not correct invitation code',
        'dlzc_yxgscw': 'Not correct email',
        'dlzc_sjhwzcqqwzc': 'Mobile number is not registered, please go to register',
        'dlzc_yzmygqqcxfs': 'Verification code does not exist or has expired, please resend',
        'dlzc_yzzhbty': 'Account deactivated',
        'dlzc_yzmmbaq' : 'Your password is not secure, please change it',
        'dlzc_sjhyzcqqwdl': 'Mobile number has been registered, please go to login',
        'dlzc_mm6w': 'Set password, no less than 6 digits',
        'dlzc_txxxzdn': 'Please fill in the real to make it easier for your colleagues to find you',
        'dlzc_tpscz': 'Picture uploading...',
        'dlzc_sccg': 'Successfully Upload',

        'dlzc_dlz': 'Logining... ',
        'dlzc_wcxg': 'Modify Complete',
        'dlzc_mmlwzmsz': 'The password may contain both letters and Numbers, no less than 6 characters',
        'dlzc_scsb': 'Upload Fail',
        'dlzc_qsryqm': 'Please enter the invitation code',
        'dlzc_bcsb': 'Save failed',
        'dlzc_zcxy': 'Whale quasi user registration agreement',
        'dlzc_zhmidl': 'Account password login',

        'dlzc_sjhssz': "Please enter the correct mobile phone number",
        'dlzc_zjgsbd': "The landline number is not in the right format",






        //-----------------------时间控件---------------------
        'sskj_dangtian': 'Today',
        'sskj_yiyue': 'Jan',
        'sskj_eryue': 'Feb',
        'sskj_sanyue': 'March',
        'sskj_siyue': 'April',
        'sskj_wuyue': 'May',
        'sskj_liuyue': 'June',
        'sskj_qiyue': 'July',
        'sskj_bayue': 'Aug',
        'sskj_jiuyue': 'Sept',
        'sskj_shiyue': 'Oct',
        'sskj_shiyiyue': 'Nov',
        'sskj_shieryue': 'Dec',

        'qt_tsxx': 'Prompt Message',
        'qt_queren': 'ok',


        'ts_qjcwl': 'Network error, please try again later!',
        'getTokenFailed' : 'Failed to get token',
        'ts_szcg': 'Setting Successful',
        'ts_qxcg': 'Cancel Successful',
        'gz_onlyNumber':'Can only enter  letters and numbers',

        'gzzt_dc': 'Booking',
        'gzzt_fx': 'Drop',
        'gzzt_fc': 'Return Yard',
        'gzzt_tkx': 'Pick Up',
        'gzzt_rh': 'Ready packing',
        'gzzt_fx_clod': 'Packing',
        'gzzt_jg': 'Ready gate in',
        'gzzt_jc': 'Gate In',
        'gzzt_hgfx': 'Custom Release',
        'gzzt_mtfx': 'Terminal Release',
        'gzzt_zc': 'Loaded',
        'gzzt_lg': 'Sailing',
        'gzzt_zzkh': 'Sailing',
        'gzzt_zzzc': 'Loaded',
        'gzzt_zzdg': 'Arrival',
        'gzzt_zzxc': 'Discharged',
        'gzzt_dg': 'Discharged',
        'gzzt_xc': 'Unload',
        'gzzt_tgh': 'Consignee',
        'gzzt_hk': 'Return',
        'gzzt_tg': 'Cancel',
        'gzzt_cy': 'Check',
        'gzzt_ddqyg': 'Arrival at POL',
        'gzzt_jhlg': 'PlannedDeparture',
        'gzzt_ysz': 'Sailing',
        'gzzt_ddmdd': 'Arrival at POD',
        'gzzt_ddzzg': 'Arrival at POT',
         ///////////////////////////跟踪详情节点翻译//////////////////////////
         'gzjd_xq_dc': 'Booking',
         'gzjd_xq_fx': 'Drop box',
         'gzjd_xq_tkx': 'Empty box',
         'gzjd_xq_fc': 'return',
         'gzjd_xq_rh': 'restock',
         'gzjd_xq_zx': 'boxing',
         'gzjd_xq_jg': 'setPort',
         'gzjd_xq_jingang': 'intoPort',
         'gzjd_xq_hf': 'haifang',
         'gzjd_xq_mf': 'code',
         'gzjd_hasi': 'MaritimeTelease',
         'gzjd_xq_pz': 'withload',
         'gzjd_xq_zc': 'shipment',
         'gzjd_xq_lg': 'departure',
         'gzjd_xq_zzkh': 'transitSail',
         'gzjd_xq_zzzc': 'transhipment',
         'gzjd_xq_zzdg': 'transitArrival',
         'gzjd_xq_zzxc': 'transitShip',
         'gzjd_xq_dg_xc': 'arrivalUnloading',
         'gzjd_xq_th': 'Arrival',
         'gzjd_xq_dd': 'pickPp',
         'gzjd_xq_hc': 'stillEmpty',
         'gzjd_xq_tg': 'Exit',
         'gzjd_tjd': 'ViaWay'
    });

    $translateProvider.translations('zh', {
        //-----------------------手机船期---------------------
        'sjcq_cq': '船期',
        'sjcq_gz': '跟踪',
        'sjcq_wd': '我的',
        'sjcq_qxzqyg': '请选择起运港',
        'sjcq_qxzmdg': '请选择目的港',
        'sjcq_qis' : '起始港',
        'sjcq_mud' : '目的港',
        'sjcq_riq' : '日期',
        'sjcq_lg': '离港',
        'sjcq_dg': '到港',
        'sjcq_cx': '查询',
        'sjcq_history': '历史记录',
        'sjcq_etd': 'ETD',
        'sjcq_bz': '本周',
        'sjcq_xyz': '下一周',
        'sjcq_xerz': '下二周',
        'sjcq_xsz': '下三周',
        'sjcq_zd': '直达',
        'sjcq_zz': '中转',
        'sjcq_zyzezszszwzlzr': '周一 周二 周三 周四 周五 周六 周日',
        'sjcqc_jbc': '加班船',
        'sjcq_tcdc': '头程',
        'sjcq_bc': '驳船',
        'sjcq_tl': '铁路',
        'sjcq_tc': '拖车',
        'sjcq_yc': '延迟',

        'sjcq_zhund': '准点',
        'sjcq_yanw': '延误',
        'sjcq_tq': '提前',
        'sjcq_th': '停航',
        'sjcq_tg': '跳港',
        'sjcq_cmdd': '船名待定',
        'sjcq_stop': '空班',

        'sjcq_jh': '计划',
        'sjcq_gcc': '共舱船',
        'sjcq_cwfk': '报错',
        'sjcq_ljgz': '跟踪',
        'sjcq_ygz': '已跟踪',
        'sjcq_cm': '船名',
        'sjcq_cc': '航次',
        'sjcq_hxdm': '航线代码',
        'sjcq_tjgk': '途径港口',
        'sjcq_mtcz': '码头信息',
        'sjcq_kgsj': '开港时间',
        'sjcq_jgangsj': '截港时间',
        'sjcq_jdsj': '截单时间',
        'sjcq_jguansj': '截关时间',
        'sjcq_jhkb': '计划靠泊',
        'sjcq_sjkb': '实际靠泊',
        'sjcq_jhlb': '计划离泊',
        'sjcq_sjlb': '实际离泊',
        'sjcq_zdl': '准点率',
        'sjcq_zdfx': '准点分析',
        'sjcq_zdfx': '准点分析',
        'sjcq_jzz': '加载中...',
        'sjcq_qsrqsg': '请输入起始港',
        'sjcq_qsrmdg': '请输入目的港',
        'sjcq_td': '天到',
        'sjcq_t': '天',
        'sjcq_czcc': '操作成功',
        'sjcq_czsb': '操作失败',
        'sjcq_fwgd': '未登录访问次数过多，请登录',
        'sjcq_ykcx': '游客一天只能查询3次，请登录继续使用',
        'sjcq_jhlg': '计划离港',
        'sjcq_jhdg': '计划到港',
        'sjcq_Mon': '周一',
        'sjcq_Tue': '周二',
        'sjcq_Wed': '周三',
        'sjcq_Thu': '周四',
        'sjcq_Fri': '周五',
        'sjcq_Sat': '周六',
        'sjcq_Sun': '周日',
        'sjcq_zwsj': '暂无数据',
        'sjcq_zwgk': '暂无港口',
        'sjcq_zwcgs': '暂无船公司',
        'sjcq_mqzusj': '暂无数据哦',
        'sjcq_ckwzlj': '查看完整路径',
        'sjcq_sqlwz': '收起',
        //-----------------------手机跟踪---------------------
        'sjgz_wdgz': '我的跟踪',
        'sjgz_ksty': '开始体验',
        'sjgz_gzcbhxhssdt_top': '您可在此跟踪船舶和箱货的全程节点',
        'sjgz_gzcbhxhssdt_bottom': '并获得实时动态提醒 !',
        'sjgz_tjgz': '添加跟踪',
        'sjgz_xhgz': '箱货跟踪',
        'sjgz_sl': '示例',
        'sjgz_cbgz': ' 船舶跟踪',
        'sjgz_cbgzsl': '示例（先查询船期->在跟踪船期）',
        'sjgz_gjtstbqbxhhcb': '根据提示图标区别箱货和船舶',

        'sjgz_xh': '箱货',
        'sjgz_cb': '船舶',
        'sjgz_tdhdchxhy': '提单号/订舱号',
        'sjgz_ptdhdchxhy': '请输入提单号/订舱号',
        'sjgz_xzcgs': '选择船公司',
        'sjgz_gz': '跟踪',

        'sjgz_tjqb': '全部',
        'sjgz_lgq': '离港前',
        'sjgz_zt': '在途',
        'sjgz_dg': '到港',
        'sjgz_wc': '完成',
        'sjgz_yc': '异常',
        'sjgz_cx': '查询中',
        'sjgz_axzr': '按新增日',
        'sjgz_algr': '按离港日',
        'sjgz_tkx': '提空箱',
        'sjgz_jg': '进港',
        'sjgz_hf': '海放',
        'sjgz_mf': '码放',
        'sjgz_zc': '上船',
        'sjgz_lg': '离港',
        'sjgz_dg': '到港',
        'sjgz_th': '提货',
        'sjgz_hk': '还空',
        'sjgz_tl': '铁路',
        'sjgz_tl_Boxing': '铁运装箱', // IRLB
        'sjgz_tl_Departure': '铁运发车', // IRDP
        'sjgz_tl_unloadBox': '铁运卸箱', // IRDS
        'sjgz_tl_arrivals' :'到达', //铁运到站
        'sjgz_tjcwfk': '报错',
        'sjgz_sjtx': '提醒',
        'sjgz_ytx': '已提醒',
        'sjgz_qxtx': '取消提醒',
        'sjgz_lrdh': '录入提单号',
        'sjgz_qsrdh': '请输入提单号',
        'sjgz_qx': '取消',
        'sjgz_qd': '确定',
        'sjgz_t': '天',
        'sjgz_qxdl': '请先登录',

        //-----------------------手机其他页---------------------
        'sjqty_gkss': '港口搜索',
        'sjqty_qxzgk': '请选择港口',
        'sjqty_tjgk': '推荐港口',
        'sjqty_cgsss': '船公司搜索',
        'sjqty_qxzcgs': '请选择船公司',
        'sjqty_tjcgs': '推荐船公司',

        'sjqty_zxkf': '在线客服',
        'sjqty_yy': '语言',
        'sjqty_gy': '关于',
        'sjqty_fwxy': '服务协议',
        'sjqty_ysxy': '隐私协议',
        'sjqty_bbh': '版本号',
        'sjqty_language': '中文',
        'sjqty_english': 'English',

        'sjqty_grxx': '个人信息',
        'sjqty_tx': '头像',
        'sjqty_nc': '昵称',
        'sjqty_xb': '性别',
        'sjqty_zw': '职务',
        'sjqty_ssgs': '公司',
        'sjqty_sj': '手机',
        'sjqty_zj': '座机',
        'sjqty_yx': '邮箱',
        'sjqty_tcdl': '退出登录',

        //-----------------------船期---------------------
        'cq_cq': '船期',
        'cq_gz': '跟踪',
        'cq_api': 'API',
        'cq_xz': '下载',
        'cq_dl': '登录',
        'cq_mfsy': '免费试用',
        'cq_jzsjrhdgzy': '鲸准数据，让货代更专业！',
        'cq_qxzqyg': '请选择起运港',
        'cq_qsrmdgzwyw': '请输入目的港中文/英文',
        'cq_lg': '离港',
        'cq_dg': '到港',
        'cq_cx': '查询',
        'cq_cq': '船期',
        'cq_gcmc': '共舱/母船',
        'cq_lszdl': '历史准点率',
        'cq_jbctx': '加班船提醒',
        'cq_tgthywyj': '跳港/停航/延误预警',
        'cq_cbgz': '船舶跟踪',
        'cq_wl30tgkjh': '未来30天挂靠计划',
        'cq_gq7thxgj': '过去7天航行轨迹',
        'cq_dqwz': '当前位置',
        'cq_cbda': '船舶档案',
        'cq_xhgz': '箱货跟踪',
        'cq_ctxdmddhxqcgz': '从提箱到目的地还箱全称跟踪 ',
        'cq_jgjdkjgtx': '截关/截单/开截港提醒',
        'cq_mtcbjhtx': '码头船舶计划提醒',
        'cq_sxjyyj': '甩箱/查验预警',
        'cq_zzgxzzlyj': '中转港箱子滞留预警',
        'cq_xzjz': '下载鲸准',
        'cq_Windowsdnd': 'windows电脑端',
        'cq_wxgzh': '微信公众号',

        'cq_lgr': '离港日',
        'cq_dgr': '到港日',
        'cq_cx': '查询',
        'cq_bz': '本周',
        'cq_xyz': '下一周',
        'cq_xerz': '下二周',
        'cq_xsz': '下三周',
        'cq_yXXXXfwXXXXgyXzzhfw,Xzzzfw': '由XXXX发往XXXX共有X组直航服务，X组中转服务',
        'cq_dbmc': '代表母船',
        'cq_dblsgc': '代表临时共舱',
        'cq_dbbzbjh': '代表本周不接货',
        'cq_jzsx': '精准筛选',
        'cq_zd': '直达',
        'cq_zz': '中转',
        'cq_sj': '时间',
        'cq_yesswlr': '一 二 三 四 五 六 日 ',
        'cq_cgs': '船公司',
        'cq_qb': '全部',
        'cq_mt': '码头',
        'cq_qyg': '起运港',
        'cq_mdg': '目的港',
        'cq_qb': '全部',
        'cq_qktj': '清空条件',
        'cq_cqfa': '船期方案',
        'cq_hc': '航程',
        'cq_tcdcdt': '头程大船动态',
        'cq_cz': '操作',
        'cq_zyzezszszwzlzr': '周一 周二 周三 周四 周五 周六 周日',
        'cq_cm': '船名',
        'cq_hc': '航次',
        'cq_xq': '详情',
        'cq_gdzzfa': '更多中转方案',
        'cq_bc': '驳船',
        'cq_tl': '铁路',
        'cq_tc': '拖车',
        'cq_yc': '延迟',
        'cq_th': '停航',
        'cq_tg': '跳港',
        'cq_jbc': '加班船',
        'cq_qqcqmzsm': '全球船期免责声明：鲸准提供全球船期相关信息，包括但不限于船名、航次、航线代码、共舱、离港到港日期，以及港口船舶计划信息， 包含：挂靠码头、开/截港日、实际靠泊、实际离泊时间等。来源于全球各大船公司、各大码头及相关部门公布数据。由于信息随时变化，以及网络传输问题， 鲸准提供的此类信息可能并非最新或存在误差，因此仅供参考，任何公司或个人不能将此作为鲸准做出的任何承诺。',
        'cq_qxzqyg': '请选择起运港',
        'cq_qxzmdg': '请选择目的港',


        //-----------------------跟踪---------------------
        'gz_srdchtdhxh': '输入订舱号/提单号/箱号',
        'gz_xzcgs': '选择船公司',
        'gz_gz': '跟踪',
        'gz_qb': '全部',
        'gz_wsj': '无数据',
        'gz_tkx': '提空箱',
        'gz_jg': '进港',
        'gz_hf': '海放',
        'gz_mf': '码放',
        'gz_zc': '上船',
        'gz_lg': '离港',
        'gz_dg': '到港',
        'gz_th': '提货',
        'gz_hk': '还空',
        'gz_ssydnr': '搜索运单内容',
        'gz_mrpx': '默认排序',
        'gz_akhr': '按开航日',
        'gz_axzr': '按新增日',
        'gz_agxr': '按更新日',
        'gz_qx': '全选',
        'gz_sjtx': '手机提醒',
        'gz_plsc': '批量删除',
        'gz_kg': '开港',
        'gz_jg': '截港',
        'gz_jd': '截单',
        'gz_tx': '提醒',
        'gz_ytx': '已提醒',
        'gz_ldh': '录单号',
        'gz_qlrdchtdhxh': '请录入订舱号/提单号',
        'gz_qx': '取消',
        'gz_qd': '确定',
        'gz_lbz': '录备注',
        'gz_qlrgydhdbzxx': '请录入该运单的备注信息',
        'gz_srtdhgzcjd': '输入提单号 跟踪查进度',
        'gz_bqmyztgzxx': '(*>﹏<*) 抱歉！没有这条跟踪信息',
        'gz_xhgzmzsm': '"箱货跟踪免责声明：鲸准提供箱货跟踪信息，包括提空箱、装箱、进港、海关放行、码头放行、上船、离港、到达中转港、中转卸船、中转上船、中转离港、到港、卸货、提货、还空箱等节点；还提供码头船舶计划，截港、截单时间等。来源于全球各大船公司、各大码头及相关部门公布数据。由于信息随时变化，以及网络传输问题， 鲸准提供的此类信息可能并非最新或存在误差，因此仅供参考，任何公司或个人不能将此作为鲸准做出的任何承诺。"',
        'gz_sjhzhqz': '数据还在获取中',
        'gz_wuygq': '提单号无效或已过期，请核实后再查。',
        'gz_j': '件',
        'gz_z': '重',
        'gz_t': '体',
        'gz_cwfk': '错误反馈',
        'gz_sjtx': '手机提醒',
        'gz_qxzqyg': '请选择起运港',
        'gz_qxzmdg': '请选择目的港',
        'gz_qxtxcnsc': '取消提醒才能删除',
        'gz_sccg': '删除成功',

        'gz_qsrgzdh': '请输入跟踪单号',
        'gz_qxzcgs': '请选择船公司',



        //-----------------------API---------------------
        'api_jzapifw': '鲸准API服务',
        'api_jzffdapifw,fbnkjgjzjdznhhy': '鲸准丰富的API服务，方便您快速构建自己的智能化航运！',
        'api_zxsq': '在线申请',
        'api_cqsj': '船期数据',
        'api_xhgz': '箱货跟踪',
        'api_dtsksh': '地图式可视化',
        'api_hxcq': '航线船期',
        'api_aqygmdgcxcqsj': '按起运港、目的港，查询船期数据',
        'api_cbcq': '船舶船期',
        'api_acmcxgcbdhxcqhgkgxx': '按船名，查询该船舶的航线船期和挂靠港信息',
        'api_lszdl': '历史准点率',
        'api_aqygmdghxdmcx': '按起运港、目的港、航线代码，查询过去90天的准点率。',
        'api_xhgz': '箱货跟踪',
        'api_mtcbjh': '码头船舶计划',
        'api_atdhxh': '按提单号/箱号，查询船舶计划靠泊、实际靠泊、计划离泊、实际离泊',
        'api_mtxhgz': '码头箱货跟踪',
        'api_atdhxhcx': '按提单号/箱号，查询进港、海关放行、码头放行、配载上船信息',
        'api_cgsxhgz': '船公司箱货跟踪',
        'api_atdhxhcxtkx': '按提单号/箱号，查询提空箱、进港、上船、离港、到港、卸船、提货、还空箱',
        'api_dtsxhgz': '地图式箱货跟踪',
        'api_atdhxhcxyddcqgh': '按提单号/箱号，查询运单的船期规划，船舶的当前位置，过去7天的形式轨迹，目的港ETA和剩余航程。',
        'api_jzfnmygwlrwxxt': '鲸准赋能每一个物流人无限协同，无限创造的能力！',
        'api_zxzx': '在线咨询',


        //-----------------------登录&注册---------------------
        'dlzc_gxtywmdcphyzc': '感谢体验我们的产品，欢迎注册！',
        'dlzc_sjhm': '手机号码',
        'dlzc_qsrndsjhm': '请输入您的手机号',
        'dlzc_yzm': '验证码',
        'dlzc_qsryzm': '请输入验证码',
        'dlzc_yzmyfsz': '验证码已发送至',
        'dlzc_cxhq': '秒后重新获取',
        'dlzc_hqyzm': '获取验证码',
        'dlzc_fsyzm': '发送验证码',
        'dlzc_mm': '密码',
        'dlzc_qsrmm': '请输入密码',
        'dlzc_yqm': '邀请码',
        'dlzc_qsryqm': '请输入邀请码',
        'dlzc_wczcjdbnty': '完成注册即代表您同意',
        'dlzc_jjyhxy': '鲸准用户注册协议',
        'dlzc_wczc': '完成注册',
        'dlzc_yzhzjdl': '有账号？直接登录',
        'dlzc_qdlzhhmm': '请输入账号和密码',
        'dlzc_sjyzmdl': '手机验证码登录',
        'dlzc_yzmdl': '验证码登录',
        'dlzc_gxtywmdcphydl': '感谢体验我们的产品，欢迎登录！',
        'dlzc_jzw': '记住我',
        'dlzc_dl': '登录',
        'dlzc_wjmm': '忘记密码？',
        'dlzc_hmyzh': '还没有账号？',
        'dlzc_ljzc': '立即注册',

        'dlzc_sexnr': "男",
        'dlzc_sexvr': "女",
        'dlzc_srndsjh': '输入您的手机号，我们将向您的手机发送验证码来帮您找回密码',
        'dlzc_tj': '提交',

        'dlzc_yzyldmm': '验证您的原密码来修改密码',
        'dlzc_ymm': '原密码',
        'dlzc_qsrymm': '请输入原密码',
        'dlzc_mm': '密码',
        'dlzc_qsrmm': '请输入密码',
        'dlzc_qrmm': '确认密码',
        'dlzc_qqrmm': '请确认密码',
        'dlzc_bc': '保存',
        'dlzc_czmm': '重置密码',
        'dlzc_xmm': '新密码',
        'dlzc_zc': '注册',
        'dlzc_wsxx': '完善信息',
        'dlzc_yjzcgl': '已经注册过了, ',
        'dlzc_ljdl': '立即登录',
        'dlzc_zhsz': '账号设置',
        'dlzc_tcdl': '退出登录',
        'dlzc_ndyqm': '您的邀请码',
        'dlzc_jbxx': '基本信息',
        'dlzc_grxx': '个人信息',
        'dlzc_yhm': '用户名',
        'dlzc_qsryhm': '请输入用户名',
        'dlzc_sjhm': '手机号码',
        'dlzc_qsrsjhm': '请输入手机号码',
        'dlzc_yxdz': '邮箱地址',
        'dlzc_qsryxdz': '请输入邮箱地址',
        'dlzc_mm': '密码',
        'dlzc_qsrmm': '请输入密码	',
        'dlzc_rgnxxgmmqdjzl': '如果您想修改密码请点击这里',
        'dlzc_gsxx': '公司信息',
        'dlzc_wrz': '未认证',
        'dlzc_yrz': '已认证',
        'dlzc_zsxm': '真实姓名',
        'dlzc_qsrzsxm': '请输入昵称',
        'dlzc_gszw': '公司职位',
        'dlzc_qsrgszw': '请输入职位',
        'dlzc_gsmc': '公司名称',
        'dlzc_qsrgsmc': '请输入企业名称',
        'dlzc_bgdh': '办公电话',
        'dlzc_qsrbgdh': '请输入办公电话',
        'dlzc_gswz': '公司网址',
        'dlzc_qsrgswz': '请输入公司网址',
        'dlzc_gsdz': '公司地址',
        'dlzc_qsrgsdz': '请输入公司地址',
        'dlzc_ywys': '业务优势',
        'dlzc_qsrywys': '请输入业务优势',
        'dlzc_sjxx': '社交信息',
        'dlzc_qq': 'QQ',
        'dlzc_qsrqq': '请输入QQ',
        'dlzc_wx': '微信',
        'dlzc_qsrwx': '请输入微信',
        'dlzc_wb': '微博',
        'dlzc_qsrwb': '请输入微博',
        'dlzc_skype': 'Skype',
        'dlzc_qsrskype': '请输入Skype',
        'dlzc_facebook': 'Facebook',
        'dlzc_qsrfacebook': '请输入Facebook',
        'dlzc_twitter': 'Twitter',
        'dlzc_qsrtwitter': '请输入Twitter',
        'dlzc_bc': '保存',
        'dlzc_smrz': '实名认证',
        'dlzc_smrzxx': '实名认证：您的特权身份证；通过企业实名，您可以额外获得60的会员使用期限',
        'dlzc_qscndxx': '请上传您的名片或工作牌或企业营业执照副本扫描件，我们将在一个工作日以内与您取得联系并完成审核。',
        'dlzc_zzgs': '支持GIF/JPEG/PNG/BMP格式,最大支持4M',
        'dlzc_djsctp': '点击上传图片',
        'dlzc_tjsmrz': '提交实名认证',
        'dlzc_zhhmmcw': '账号或密码错误！',
        'dlzc_yzmsrcwhdhsr': '验证码输入错误，请核对后输入',
        'dlzc_yqmcwhdhsr': '邀请码错误请核对后输入',
        'dlzc_yxgscw': '邮箱格式错误 ',
        'dlzc_sjhwzcqqwzc': '手机号未注册， 请前往注册',
        'dlzc_yzmygqqcxfs': '验证码不存在或已过期，请重新发送',
        'dlzc_yzzhbty': '账号被停用',
        'dlzc_yzmmbaq' : '您的密码不安全，请修改密码',
        'dlzc_sjhyzcqqwdl': '手机号已注册，请前往登录',
        'dlzc_mm6w': '设置密码，不低于6位',
        'dlzc_txxxzdn': '请填写真实信息，让你的同事更容易找到你',
        'dlzc_tpscz': '图片上传中...',
        'dlzc_sccg': '上传成功',
        'dlzc_dlz': '登录中...',
        'dlzc_wcxg': '完成修改',
        'dlzc_mmlwzmsz': '密码可同时包含字母和数字，不少于6个字符',
        'dlzc_scsb': '上传失败',
        'dlzc_qsryqm': '请输入邀请码',
        'dlzc_bcsb': '保存失败',
        'dlzc_zcxy': '鲸准用户注册协议',

        'dlzc_zhmidl': '账号密码登录',
        'dlzc_sjhssz': "请输入正确的手机号",
        'dlzc_zjgsbd': "座机号格式不对",
        //-----------------------时间控件---------------------
        'sskj_yiyue': '一月',
        'sskj_eryue': '二月',
        'sskj_sanyue': '三月',
        'sskj_siyue': '四月',
        'sskj_wuyue': '五月',
        'sskj_liuyue': '六月',
        'sskj_qiyue': '七月',
        'sskj_bayue': '八月',
        'sskj_jiuyue': '九月',
        'sskj_shiyue': '十月',
        'sskj_shiyiyue': '十一月',
        'sskj_shieryue': '十二月',
        'sskj_dangtian': '当天',

        'qt_tsxx': '提示信息',
        'qt_queren': '确定',
        'ts_qjcwl': '请检查网络',
        'getTokenFailed' : '获取token失败',
        'ts_szcg': '设置成功',
        'ts_qxcg': '取消成功',
        'gz_onlyNumber':'只能输入字母和数字',
        ///////////////////////////跟踪状态翻译//////////////////////////
        'gzzt_dc': '订舱',
        'gzzt_fx': '放箱',
        'gzzt_fc': '返场',
        'gzzt_tkx': '提空箱',
        'gzzt_rh': '入货',
        'gzzt_fx_clod': '封箱',
        'gzzt_jg': '集港',
        'gzzt_jc': '进场',
        'gzzt_hgfx': '海放',
        'gzzt_mtfx': '码放',
        'gzzt_zc': '上船',
        'gzzt_lg': '离港',
        'gzzt_zzkh': '中转开航',
        'gzzt_zzzc': '中转装船',
        'gzzt_zzdg': '中转抵港',
        'gzzt_zzxc': '中转卸船',
        'gzzt_dg': '到港',
        'gzzt_xc': '卸船',
        'gzzt_tgh': '提货',
        'gzzt_hk': '还空',
        'gzzt_tg': '退关',
        'gzzt_cy': '查验',
        'gzzt_ddqyg': '到达起运港',
        'gzzt_jhlg': '计划离港',
        'gzzt_ysz': '运输中',
        'gzzt_ddmdd': '到达目的地',
        'gzzt_ddzzg': '到达中转港',


         ///////////////////////////跟踪详情节点翻译//////////////////////////
         'gzjd_xq_dc': '订舱',
         'gzjd_xq_fx': '放箱',
         'gzjd_xq_tkx': '提空箱',
         'gzjd_xq_fc': '返场',
         'gzjd_xq_rh': '入货',
         'gzjd_xq_zx': '装箱',
         'gzjd_xq_jg': '集港',
         'gzjd_xq_jingang': '进港',
         'gzjd_xq_hf': '海放',
         'gzjd_xq_mf': '码放',
         'gzjd_hasi': '海事',
         'gzjd_xq_pz': '配载',
         'gzjd_xq_zc': '上船',
         'gzjd_xq_lg': '离港',
         'gzjd_xq_zzdg': '抵港',
         'gzjd_xq_zzxc': '卸船',
         'gzjd_xq_zzzc': '装船',
         'gzjd_xq_zzkh': '离港',
         'gzjd_xq_dg_xc': '到港/卸船',
         'gzjd_xq_th': '提货',
         'gzjd_xq_dd': '到达',
         'gzjd_xq_hc': '还空',
         'gzjd_xq_tg': '退关',
         'gzjd_tjd': '途经地',
    });

    $translateProvider.preferredLanguage('zh');
}])
app.factory('locals', ['$window', function($window) {
    return { //存储单个属性
        set: function(key, value) {
            $window.localStorage[key] = value;
        }, //读取单个属性
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        }, //存储对象，以JSON格式存储
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value); //将对象以字符串保存
        }, //读取对象
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}'); //获取字符串并解析成对象
        }

    }
}])
//定义http拦截器httpInterceptor，这个factory返回的对象可以拥有responseError，response，request，requestError这些属性，分别对应拦截的处理。
app.factory('httpInterceptor', [ '$q',function($q) {
    var httpInterceptor = { 
      'responseError' : function(response) { //响应错误拦截
        //这里可以对不同的响应错误进行处理，比如根据返回状态码进行特殊处理
        switch(response.status) {
            case 401: //token失效
                localStorage.removeItem("gateway_token")
                location.href = "#/tab/login"
                break
            case 404: //找不到地址
                // localStorage.removeItem("gateway_token")
                // location.href = "#/tab/login"
                break
            case 403: //没有权限
                // localStorage.removeItem("gateway_token")
                // location.href = "#/tab/login"
                break
            default:
                return $q.reject(response)
        }
        return $q.reject(response); 
      }, 
      'response' : function(response) {     //响应拦截
        //这里可以对所有的响应的进行处理
        return response; 
      }, 
      'request' : function(config) {        //请求拦截
        //这里可以对所有的请求进行处理
        return config; 
      }, 
      'requestError' : function(config){    //请求错误拦截
        //这里可以对所有的请求错误进行处理
        return $q.reject(config); 
      } 
    } 
  return httpInterceptor; 
}])

//测试
// var baseUrl = 'http://47.114.202.170'

//线上
var baseUrl = 'https://api.ijingzhun.com'

//地图地图地址
var mapUrl = 'https://map.ijingzhun.com/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'

var shipLogoUrl = 'https://jingzhun.oss-cn-hangzhou.aliyuncs.com/images/'
var timeOut = 30000;
var tokenAuth = 'Basic YXBwOnNlY3JldA=='
var baseQQ = '68381850';
var tokenUrl = baseUrl + '/auth/oauth/token'

var basic_icon = 'https://s3.cn-northwest-1.amazonaws.com.cn/xdata'
//全局报错反馈 联系客服
function contactCustomer () {
    //app
    // window.open("https://tb.53kf.com/code/client/638bf58335176d932b75ab10e96545745/1",'_blank')
    
    //微信公众号
    location.href = "https://tb.53kf.com/code/client/638bf58335176d932b75ab10e96545745/1"
}

//取token
function getTokenInfor(){
    var authorization = ''
    //验证是否有token
    if(localStorage.getItem('gateway_token')){
        authorization = localStorage.getItem('gateway_token')
     }else{
        //说明是账号密码进的app 有token
       if(localStorage.getItem('storedInfor')){
            var queryToken = JSON.parse(localStorage.getItem('storedInfor'))
            $.ajax({
                type: "POST",
                url: tokenUrl,
                timeout: timeOut,
                async: false,
                headers: {
                    Authorization: tokenAuth
                },
                data: queryToken,        
                success: function(data) {
                    if (data.userId) { //成功
                        authorization = "Bearer " + data.access_token
                        localStorage.setItem('gateway_token',authorization)
                        return authorization
                    }
                },
            });
        }else{ //无token
            $.ajax({
                url: tokenUrl + "?grant_type=client_credentials",
                type: "POST",
                async: false,
                headers: {
                Authorization: tokenAuth
                },
                success: function (data) {
                if (data.access_token) {
                    authorization = "Bearer " + data.access_token;
                    return authorization
                } 
                },
            })
        }
     }
    return authorization
}

// 设置参数
function setParams(data) {
    var that = this;
    var md5 = '';
    $.ajax({
      url: baseUrl + "/schedules/web/set",
      type: "POST",
      async: false,
      data: JSON.stringify(data),
      headers: {
        Authorization: getTokenInfor(),
        "Content-Type": "application/json"
      },
      success: function (data) {
        if(data.content){ //有值
          md5 = data.content
        }else{
            location.href = "#/tab/login"
        }
      }
    });
    return md5;
  }
  
  // 设置参数
  function getParams(md5) {
    var that = this;
    var json = {};
    $.ajax({
      url: baseUrl + `/schedules/web/get?md5=${md5}`,
      type: "GET",
      async: false,
      headers: {
        Authorization: getTokenInfor()
      },
      success: function (data) {
        if(data.content){
          json = data.content
        }else{
            location.href = "#/tab/login"
        }
      }
    });
    return json;
  }
  
/*
    提示信息，弹层/弹窗
    杨卿林
    2020-03-16
    PS：感谢刘嵩
*/
app.factory('Popup', function($translate, $ionicPopup, $timeout) {
    return {
        showAlert: function(msg, okurl) {
            var qt_tsxx = $translate.instant('qt_tsxx');
            var qt_queren = $translate.instant('qt_queren');

            var alertPopup = $ionicPopup.alert({
                title: qt_tsxx,
                template: msg,
                okText: qt_queren
            });
            alertPopup.then(function(res) {
                if (okurl != null && okurl != '') {
                    location.href = okurl;
                }
            });
            $timeout(function() {
                alertPopup.close(); // 3秒后关闭弹窗
            }, 3000);
        },
    }
});
app.factory('Popup2', function($translate, $ionicPopup, $timeout, $ionicHistory, $state) {
    return {
        showAlert: function(msg, okurl) {
            var qt_tsxx = $translate.instant('qt_tsxx');
            var qt_queren = $translate.instant('qt_queren');

            var alertPopup = $ionicPopup.alert({
                title: qt_tsxx,
                template: msg,
                okText: qt_queren
            });
            alertPopup.then(function(res) {
                if (okurl != null && okurl != '') {
                    //里面这旮瘩和tabShowHid.js是一样的
                    if (okurl != 'login') {
                        $ionicHistory.clearCache().then(function() {
                            if (okurl.indexOf('/trackList') > -1) {
                                if ($('#map').length > 0) {
                                    $('#map').removeAttr('id');
                                }
                                $state.go('tab.trackList', {});
                            } else {
                                location.href = okurl;
                            }
                        });
                    } else {
                        location.href = okurl;
                    }
                }
            });
        },
    }
});