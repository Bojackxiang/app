$(document).ready(function () {
  // *****************************************************
  // menu bar sliding
  $(".closebtn").click(function () {
    $(".navbar-content").css('display','none');
    $("#mySidenav").css('width', '0px');

  });

  $(".openNav").click(function () {
    $("#mySidenav").css('width', '250px');
    $(".navbar-content").css('display','block');
  });
  // *****************************************************
  // button sliding

  function phonetset(phone) {
    var phoneExpression = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
    // 电话有效
    var result = phone.match(phoneExpression)
    if (result == null) {
      console.log("电话无效");
      return false;
    } else {
      console.log("有效");
      return true;
    }

  }

  function emailValidation(email) {
    console.log("run email checker");
    var emailAddress = email.split("");
    if (emailAddress.indexOf("@") > 0) {
      return true;
    } else {
      return false;
    }
  }

  function formValidation(name, school, email, phone) {
    var emailResult = emailValidation(email);
    var phoneResult = phonetset(phone);

    console.log(phoneResult)

    if (!name) {
      $(".name-warning").css("display", "inline-block");
      return
    }

    if (!email) {
      $(".email-warning").css("display", "inline-block");
      return
    }

    if (!phoneResult) {
      $(".phone-warning").css("display", "inline-block");
      return
    }

    return true
  }

  function formValidationMobile(name, school, email, phone) {


    var emailResult = emailValidation(email);
    var phoneResult = phonetset(phone);



    if (!name) {
      $(".name-warning-m").css("display", "inline-block");
      return
    }

    if (!email) {
      $(".email-warning-m").css("display", "inline-block");
      return
    }

    if (!phoneResult) {
      $(".phone-warning-m").css("display", "inline-block");
      return
    }

    return true
  }


  $("#sliding").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#registerForm").offset().top
      },
      1000
    );
  });

  $("#aisf-button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#aisf-intro").offset().top
      },
      1000
    );
  });

  $("#all-pass-button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#all-pass-intro").offset().top
      },
      1000
    );
  });

  $("#business-button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#business-intro").offset().top
      },
      1000
    );
  });

  $("#register-button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#registerForm").offset().top
      },
      1000
    );
  });

  $("#obtain").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#registerForm").offset().top
      },
      1000
    );
  });

  $("#m-button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#m-registerForm").offset().top
      },
      1000
    );
  });

  $("#f-button").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#m-registerForm").offset().top
      },
      1000
    );
  });





  $("#submit-button").click(function (e) {
    e.preventDefault();
    e.stopPropagation();

    var name = $("#userName").val();
    var school = $("#userSchool").val();
    var emailAddress = $("#userEmail").val();
    var major = $("#userMajor").val();

    if (!formValidation(name, school, emailAddress, major)) {
      return
    }

    var body = {
      name: name,
      emailAddress: emailAddress,
      school: school,
      major: major
    };

    $.ajax({
      url: "https://www.aisfexpo.com.au/api/submit",
      type: "POST",
      dataType: "json",
      data: body,
      headers: {
        "Conent-Type": "application/x-www-form-urlencoded"
      },

      success: function (response, status, xhr) {
        if (response == "bad") {
          $(".submit-alert").css("display", "block");
          $(".submit-alert").html("您已注册过。");
        } else {
          $(".submit-alert").css("display", "block");
          $(".submit-alert").html(
            "恭喜您已成功提交，请注意查看邮箱，获取福利！"
          );
        }
      },
      error: function (data, status, xhr) {
        console.log(JSON.parse(data));
      }
    });
  });

  $("#submit-button-m").click(function (e) {
    e.preventDefault();
    e.stopPropagation();

    var namem = $("#m-userName").val();
    var schoolm = $("#m-userSchool").val();
    var emailAddressm = $("#m-userEmail").val();
    var majorm = $("#m-userMajor").val();

    if (!formValidationMobile(namem, schoolm, emailAddressm, majorm)) {
      return
    }


    var body = {
      name: namem,
      emailAddress: emailAddressm,
      school: schoolm,
      major: majorm
    };

    $.ajax({
      url: "https://www.aisfexpo.com.au/api/submit",
      type: "POST",
      dataType: "json",
      data: body,
      headers: {
        "Conent-Type": "application/x-www-form-urlencoded"
      },

      success: function (response, status, xhr) {
        if (response == "bad") {
          $(".submit-alertm").css("display", "block");
          $(".submit-alertm").html("您已注册过。");
        } else {
          $(".submit-alertm").css("display", "block");
          $(".submit-alertm").html(
            "恭喜您已成功提交，请注意查看邮箱，获取福利！"
          );
        }
      },
      error: function (data, status, xhr) {
        console.log(JSON.parse(data));
      }
    });

  });
});
