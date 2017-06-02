/////global variable
var now_page = '';
var last_page = '';
var api_route = 'http://localhost/babytube/public/api/';

var post_page_id = 'post-page-content',newsfeed_page_id = 'newsfeed-page-content',friends_page_id = 'friends-page-content',bell_page_id = 'bell-page-content',channel_profile_page_id = 'channel-profile-page-content',login_page_id = 'login-page-content',register_page_id = 'register-page-content',other_page_id = 'other-page-content',single_newsfeed_id = 'single-newsfeed-page-content',newsfeed_comment_id = 'newsfeed-comment-page-content',img_upload_preview_id = 'img-upload-preview-page-content',create_channel_page_id= 'create-channel-page-content';

var Global = {
    set_last_page: function ( page ) {
        last_page = page;
    },
    set_now_page: function ( page ) {
        now_page = page;
    },
    change_bg: function ( color ) {
        $('body').css('background-color', color);
    },
    change_pg: function ( now, next ){
        $( '#' + now ).hide();
        $( '#' + next ).show();
    },
    preview: function ( input, id ){
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#' + id ).attr('src', e.target.result);
                console.log(e.target.result);
                $('#' + id ).show();
            }
            reader.readAsDataURL(input.files[0]);
        }else{
            console.log('在這');
        }
    },
    preview_page_show: function ( input , type = 0) {
        //type 0->使用者大頭貼
        //type 1->channel大頭貼
        //type 2->channel 封面
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#img-upload-preview-show').attr('src', e.target.result);
                $('#img-upload-preview-show').attr('item', type);
            }
            reader.readAsDataURL(input.files[0]);
            Global.change_pg( now_page, img_upload_preview_id );
            Global.set_last_page ( now_page );
            Global.set_now_page ( img_upload_preview_id );
            $('#bottom-bar').hide();
            console.log( 'now:' + now_page );
            console.log( 'last:' + last_page );
        }else{
            console.log('在這');
        }
    },
    preview_page_show_upload: function ( ) {
        var src = $('#img-upload-preview-show').attr('src');
        console.log( src );
        
        var toServer = {
            ac: Forever.getItem('ac'),
            img: src
        }
        Ajax.Post('UploadImg', toServer, function(r){
            if ( r.status == 1 ) {
                alert ( r.message );
            }else{
                alert ( r.message );
            }
        })
    }
};
var Ajax = {
    Post: function (url, toSever, success ) {
        $.ajax({
            url: api_route + url,
            dataType: 'json',
            method: 'post',
            data: toSever,
            success: success
        });
    },
    Get: function ( url, toServer, success ) {
        $.ajax({
            url: api_route + url,
            dataType: 'json',
            method: 'post',
            data: toServer,
            success: success
        });
    }
};
var Forever = {
    setItem: function(name,data){
        sessionStorage.setItem( name, data);
    },
    getItem: function(name){
        return sessionStorage.getItem(name);
    }
};


////利用arry去分開page function
//////可能會用這個區分每一頁的function
var BottomBar = {
    BottomGoPost: function ( ) {
        console.log('hi');
    }
}




function Register () {
    var password = $('#password-register').val();
    var account = $('#account-register').val();
    var phone = $('#phone-register').val();
    if ( password == '' || account== '' || phone == '' ){
        alert('所有欄位皆為必填');
        return 0;
    }
    var toServer = {
        phonenum: phone,
        account: account,
        password: password
    }
    Ajax.Post('Register',toServer,function(r){
        if ( r.status == 1 ){
            Global.change_pg( register_page_id, login_page_id );
        }else{
            alert( r.message );
        }
    });
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function Login() {
    var account = $('#account-input').val();
    var password = $('#password-input').val();
    
    if ( account == '' || password == ''){
        alert('所有欄位皆為必填');
        return 0;
    }
    
    var toServer = {
        account: account,
        password: password
    }
    
    Ajax.Post('Login',toServer,function(r){
        if( r.status == 1 ){
            //change_bg( 'white' );
            Global.change_bg ( 'white' );
            Global.change_pg ( login_page_id, newsfeed_page_id );
            $('#newsfeed-btn-hottest').css('color','#FF3399');
            $('#newsfeed-btn-hottest').css('border-bottom','4px solid #FF3399');
            $('#newsfeed-btn-newest').css('border-bottom','4px solid white');
            $('#bottom-bar').show();
            Global.set_now_page ( newsfeed_page_id );
            Forever.setItem('ac',r.info.vUserCode);
            
            console.log( 'now:' + now_page );
            console.log( 'last:' + last_page );
        }else{
            alert ( r.message );
        }
    });
    
}

function BottomGoOther() {
    var toServer = {
        ac: Forever.getItem('ac')
    };
    Ajax.Post('otherpage',toServer,function(r){
       if( r.status === 1){
           console.log(r);
           var id = '#other-page-content .user-profile';
           var content = '';
           content += '<div class="profile-headimg"> <input type="file" id="other-page-change-profileimg" onchange="Global.preview_page_show(this)"> ' ;
           if ( r.info.vHeadimgUrl != '') {
               content += '<img src="' + r.info.vHeadimgUrl + '">';
           }else{
               content += '<img src="demo/profile-default.png">';
           }
           
           content += '</div><div class="profile-name"> <button> <font>'+r.info.vAccount+'</font> <img src="demo/edit2.png"> </button> </div>';
           $(id).html(content);
       }else{
           alert( r.message);
       }
    });
    Global.change_pg ( now_page, other_page_id );
    Global.set_last_page( now_page );
    Global.set_now_page ( other_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function BottomGoPost() {
    Global.change_pg ( now_page, post_page_id );
    Global.set_last_page ( now_page );
    Global.set_now_page ( post_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function BottomGoNewsfeed() {
    Global.change_pg ( now_page, newsfeed_page_id );
    Global.set_last_page ( now_page );
    Global.set_now_page ( newsfeed_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function BottomGoBell() {
    Global.change_pg ( now_page, bell_page_id );
    Global.set_last_page ( now_page );
    Global.set_now_page ( bell_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function BottomGoFriends() {
    Global.change_pg ( now_page, friends_page_id );
    Global.set_last_page ( now_page );
    Global.set_now_page ( friends_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function CreateChannel() {
    Global.change_pg ( now_page, create_channel_page_id );
    Global.set_last_page ( now_page );
    Global.set_now_page ( create_channel_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function PostReturn() {
    Global.change_pg( post_page_id, last_page);
    $('#bottom-bar').show();
    Global.set_now_page ( last_page );
    Global.set_last_page ( post_page_id );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function NewsfeedComment() {
    $('#bottom-bar').hide();
    $( '#' + newsfeed_page_id).slideUp();
    $( '#' + newsfeed_comment_id ).show();
}

function PreivewImgShowReturn() {
    Global.change_pg ( now_page, last_page );
    Global.set_now_page ( last_page );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
    var src = $('#img-upload-preview-show').attr('src','');
}

function CreateChannelReturn() {
    Global.change_pg ( now_page, last_page );
    Global.set_now_page ( last_page );
    console.log( 'now:' + now_page );
    console.log( 'last:' + last_page );
}

function GoRegisterPage() {
    Global.change_pg ( login_page_id, register_page_id );
}

function GoLoginPage() {
    Global.change_pg ( register_page_id, login_page_id );
}


/////newsfeed page event listener
$('#go-to-channel').click(function(){
    change_pg( now_page, channel_profile_page_id );
    set_last_pg ( now_page );
    set_now_page ( channel_profile_page_id );
})

//////channel profile page event listener
$('#channel-return-last-page').click(function(){
    change_pg ( now_page, last_page );
    set_now_page( last_page );
    set_last_pg( channel_profile_page_id );
})

$('#channel-profile-newsfeed-img').click( function(){
    change_pg ( now_page, single_newsfeed_id );
    set_last_pg ( now_page );
    set_now_page( single_newsfeed_id );
})
//////single newsfeed page event listener
$('#single-newsfeed-return-last-page').click(function(){
    change_pg ( now_page, last_page );
    set_now_page ( last_page );
    set_last_pg ( single_newsfeed_id );
})
$('#single-newsfeed-go-to-channel').click(function(){
    change_pg ( now_page, channel_profile_page_id );
    set_last_pg ( now_page );
    set_now_page ( channel_profile_page_id );
})
//////newsfeed comment page event listener 
$('#newsfeed-comment-return-button').click(function(){
    $('#newsfeed-page-content').slideDown();
    $('#bottom-bar').show();
    $('#newsfeed-comment-page-content').hide();
    //$('#newsfeed-page-content').show();  
})