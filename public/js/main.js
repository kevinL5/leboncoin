$(document).ready(function () {

    /* Checkbox */

    $('.type-check-input').on('change', function() {
        $('.type-check-input').not(this).prop('checked', false);  
    })

    $('.who-check-input').on('change', function() {
        $('.who-check-input').not(this).prop('checked', false);  
    })

    /* Validation */
    function checkBoxWho() {
        var whoChecked = $('input[name="who"]:checked').length > 0
        
        if (!whoChecked) {
            $('input[name="who"]').addClass('is-invalid')
        } else {
            $('input[name="who"]').removeClass('is-invalid')
        }
    }

    function checkBoxType() {
        var typeChecked = $('input[name="type"]:checked').length > 0

        if (!typeChecked) {
            $('input[name="type"]').addClass('is-invalid')
        } else {
            $('input[name="type"]').removeClass('is-invalid')
        }
    }

    $("input[name='title'], textarea[name='description'], input[name='price'], input[name='type']").click(function() {
        checkBoxWho()
        checkBoxType()
    })

    $("input[name='who']").click(function () {
        checkBoxWho()
    })

    function checkTitle() {
        var selector = "input[name='title']"
        if( $(selector).val().length < 3 || $(selector).val().length > 81) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("input[name='title']").bind("blur",  function(){
        checkTitle()
    })

    function checkDescription() {
        var selector = "textarea[name='description']"
        if( $(selector).val().length < 3 || $(selector).val().length > 1000000) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("textarea[name='description']").bind("blur",  function(){
        checkDescription()
    })

    function checkPrice() {
        var selector = "input[name='price']"
        if( isNaN(parseInt($(selector).val())) ) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("input[name='price']").bind("blur",  function(){
        checkPrice()
    })

    function checkCity() {
        var selector = "input[name='city']"
        if( $(selector).val().length < 3 || $(selector).val().length > 1000) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("input[name='city']").bind("blur",  function(){
        checkCity()
    })

    function checkPseudo() {
        var selector = "input[name='pseudo']"
        if( $(selector).val().length < 3 || $(selector).val().length > 51) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("input[name='pseudo']").bind("blur",  function(){
        checkPseudo()
    })

    function checkEmail() {
        var selector = "input[name='email']"
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if( !(regex).test( $(selector).val() ) ) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("input[name='email']").bind("blur",  function(){
        checkEmail()
    })

    function checkPhone() {
        var selector = "input[name='phone']"
        var regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/

        if( !(regex).test( $(selector).val() ) ) {
            $(selector).addClass('is-invalid')
        } else {
            $(selector).removeClass('is-invalid').addClass('is-valid')
        }
    }

    $("input[name='phone']").bind("blur",  function(){
        checkPhone()
    })


    /* Button submit */
    $(".btn-publish").click(function(event) {
        checkBoxWho()
        checkBoxType()
        checkTitle()
        checkDescription()
        checkPrice()
        checkCity()
        checkPseudo()
        checkEmail()
        checkPhone()

        if ( $('input').hasClass('is-invalid') ) {
            event.preventDefault()
        }
    })

})