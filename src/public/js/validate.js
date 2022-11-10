(function ($) {
  "use strict";

  /*==================================================================
    [ Focus Contact2 ]*/
  $(".input100").each(function () {
    $(this).on("blur", function () {
      if ($(this).val().trim() != "") {
        $(this).addClass("has-val");
      } else {
        $(this).removeClass("has-val");
      }
    });
  });

  /*==================================================================
    [ Validate Email]*/
  var inputName = $(".validate-input .input100.input-name");
  var inputEmail = $(".validate-input .input100.input-email");
  var inputPassword = $(".validate-input .input100.input-password");
  var inputConfirmPassword = $(
    ".validate-input .input100.input-confirm-password"
  );

  $(".login100-form-btn").on("click", function (e) {
    var check = true;
    e.preventDefault();

    for (var i = 0; i < inputName.length; i++) {
      if (validateName(inputName[i]) == false) {
        showValidate(inputName[i]);
        check = false;
      }
    }

    for (var i = 0; i < inputEmail.length; i++) {
      if (validateEmail(inputEmail[i]) == false) {
        showValidate(inputEmail[i]);
        check = false;
      }
    }

    for (var i = 0; i < inputPassword.length; i++) {
      if (validatePassword(inputPassword[i]) == false) {
        showValidate(inputPassword[i]);
        check = false;
      }
    }
    console.log(inputPassword, inputConfirmPassword);
    if (inputConfirmPassword.length > 0) {
      for (var i = 0; i < inputPassword.length; i++) {
        if (inputPassword[i].value !== inputConfirmPassword[i].value) {
          showValidate(inputConfirmPassword[i]);
          check = false;
        }
      }
    }

    if (check) {
      $(".validate-form").submit();
    }
    return check;
  });

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validateEmail(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function validatePassword(input) {
    if (
      $(input).attr("type") == "password" ||
      $(input).attr("name") == "password"
    ) {
      if ($(input).val().length < 6) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function validateName(input) {
    if ($(input).attr("type") == "text" && $(input).attr("name") == "name") {
      if ($(input).val().length < 6) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }
})(jQuery);
