$(function() {
  $("#datepicker").datepicker();
  $("#datepicker2").datepicker();
});

$(".pulse button").click(function() {
  var id = $(this).attr("data-goalId");
  $("#goalId").val(id);
});

/*Dropdown Menu*/
$(".dropdown").click(function() {
  $(this)
    .attr("tabindex", 1)
    .focus();
  $(this).toggleClass("active");
  $(this)
    .find(".dropdown-menu")
    .slideToggle(300);
});
$(".dropdown").focusout(function() {
  $(this).removeClass("active");
  $(this)
    .find(".dropdown-menu")
    .slideUp(300);
});
$(".dropdown .dropdown-menu li").click(function() {
  $(this)
    .parents(".dropdown")
    .find("span")
    .text($(this).text());
  $(this)
    .parents(".dropdown")
    .find("input")
    .attr("value", $(this).attr("id"));
});
/*End Dropdown Menu*/

$(".dropdown-menu li").click(function() {
  var input =
      "<strong>" +
      $(this)
        .parents(".dropdown")
        .find("input")
        .val() +
      "</strong>",
    msg = '<span class="msg">Hidden input value: ';
  $(".msg").html(msg + input + "</span>");
});

$(".delete-expense").click(function(e) {
  e.preventDefault();
  var expense_id = $(this).attr("expense-id");
  $.ajax({
    method: "POST",
    url: "/Dashboard/Expense/Delete",
    data: { expense_id: expense_id }
  }).done(function(msg) {
    console.log("success");
  });
  $(this)
    .parent()
    .parent()
    .parent("#" + expense_id)
    .hide();
});
