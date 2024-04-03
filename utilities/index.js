const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getApprovedClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.getClassifactionNames = async function (req, res, next) {
  let data = await invModel.getApprovedClassifications();
  let list = [];
  data.rows.forEach((row) => {
    list.push(row.classification_name);
  });
  return list;
};
/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getApprovedClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Select a classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetails = function (data) {
  let content = "";
  if (data) {
    content = '<div id="specifics-container">';
    content += '<div id="details-image">';
    content +=
      '<img src="' +
      data.inv_image +
      '" alt="Image of ' +
      data.inv_make +
      " " +
      data.inv_model +
      ' on CSE Motors" />';
    content += "</div>";
    content += '<div id="details">';
    content += '<div id="details-description">';
    content += "<p>" + data.inv_description + "</p>";
    content += "</div>";
    content += '<div id="details-info">';
    content += "<h3>Year: " + data.inv_year + "</h3>";
    content += "<h3>Color: " + data.inv_color + "</h3>";
    content += "<h3>Miles: " + data.inv_miles.toLocaleString() + "</h3>";
    content +=
      "<h3>Price: $" +
      new Intl.NumberFormat("en-US").format(data.inv_price) +
      "</h3>";
    content += "</div>";
    content += "</div>";
    content += "</div>";
  } else {
    content +=
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return content;
};

/* **************************************
 * Build pending approvals list
 * ************************************ */
Util.buildApprovalGrid = async function (req, res, next) {
  let data = await invModel.getUnapprovedClassifications();
  let pending = "<thead>";
  if (data.rows.length > 0) {
    pending += "<tr><th>Classification Name</th><th>Approval</th></tr>";
    pending += "</thead>";
    pending += "<tbody>";
    data.rows.forEach((row) => {
      pending += "<tr><td>" + row.classification_name + "</td>";
      pending +=
        "<td><a id='blue' href='/inv/approve/" +
        row.classification_id +
        "'>Approve</a></td></tr>";
    });
    pending += "</tbody>";
  } else {
    pending += "<p>No pending approvals</p>";
  }
  return pending;
};

Util.buildInvApprovalGrid = async function (req, res, next) {
  let data = await invModel.getUnapprovedInventory();
  let invPending = "<thead>";
  if (data.rows.length > 0) {
    invPending +=
      "<tr><th>Vehicle</th><th>Classification</th><th>Approval</th></tr>";
    invPending += "</thead>";
    invPending += "<tbody>";
    data.rows.forEach((row) => {
      invPending += "<tr><td>" + row.inv_make + " " + row.inv_model + "</td>";
      invPending += "<td>" + row.classification_name + "</td>";
      if (row.classification_approved === true) {
        invPending +=
          "<td><a id='blue' href='/inv/approveInv/" +
          row.inv_id +
          "'>Approve</a></td></tr>";
      } else {
        invPending += "<td></td></tr>";
      }
    });
    invPending += "</tbody>";
  } else {
    invPending += "<p>No pending approvals</p>";
  }
  return invPending;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type === "Admin") {
    next();
  } else if (res.locals.accountData.account_type === "Employee") {
    next();
  } else {
    req.flash("notice", "You do not have permission to view this page.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountTypeForApprovals = (req, res, next) => {
  if (res.locals.accountData.account_type === "Admin") {
    next();
  } else {
    req.flash("notice", "You do not have permission to view this page.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
