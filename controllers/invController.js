const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getApprovedInventoryByClassificationId(
    classification_id
  );
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name;
  let message = null;
  if (data.length === 0) {
    message = "Sorry, no matching vehicles are available at this time.";
  }
  res.render("./inventory/classification", {
    title: className ? className + " vehicles" : "No vehicles",
    nav,
    grid,
    errors: null,
    message,
  });
};

/* ***************************
 *  Build details view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getDetailsByInventoryId(inv_id);
  const content = utilities.buildDetails(data);
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    content,
    errors: null,
  });
};

invCont.triggerError = (req, res, next) => {
  try {
    throw new Error("500 Error: Oh No! Something broke!");
  } catch (err) {
    next(err);
  }
};

invCont.buildManagement = async (req, res, next) => {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
  });
};

invCont.buildAddClassification = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification Type",
    nav,
    errors: null,
  });
};

invCont.enterClassification = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const formResult = await invModel.enterClassification(classification_name);

  if (formResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added, but must be approved.`
    );
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the process failed. Please try again.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification Type",
      nav,
    });
  }
};

invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const select = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    select,
    errors: null,
  });
};

invCont.enterInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const invResult = await invModel.enterInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (invResult) {
    req.flash(
      "notice",
      `You have added a new inventory item, but it must be approved first.`
    );
    let nav = await utilities.getNav();
    res.status(201).redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the process failed. Please try again.");
    res.status(501).redirect("/inv/add-inventory");
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getApprovedInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getDetailsByInventoryId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getDetailsByInventoryId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body;
  const deleteResult = await invModel.deleteInventoryItem(inv_id);
  if (deleteResult) {
    req.flash("notice", `The deletion was successfully updated!`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the deletion failed.");
    res.status(501).redirect("/inv/");
  }
};

/* ***************************
 *  Manage Inventory View
 * ************************** */
invCont.approveInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const pending = await utilities.buildApprovalGrid();
  const invPending = await utilities.buildInvApprovalGrid();
  res.render("./inventory/approve", {
    title: "Manage Inventory Approvals",
    nav,
    pending,
    invPending,
    errors: null,
  });
};

/* ***************************
 *  Approve Inventory
 * ************************** */
invCont.approveClassification = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const account_id = res.locals.accountData.account_id;
  const approveResult = await invModel.approveClassification(
    classification_id,
    account_id
  );
  const pending = await utilities.buildApprovalGrid();
  const invPending = await utilities.buildInvApprovalGrid();

  if (approveResult) {
    req.flash("notice", `The classification was successfully approved.`);
    let nav = await utilities.getNav();
    res.render("./inventory/approve", {
      title: "Manage Inventory Approvals",
      nav,
      pending,
      invPending,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the process failed. Please try again.");
    res.status(501).redirect("/inv/approve");
  }
};

invCont.approveInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  const account_id = res.locals.accountData.account_id;
  const approveInvResult = await invModel.approveInventory(inv_id, account_id);
  const pending = await utilities.buildApprovalGrid();
  const invPending = await utilities.buildInvApprovalGrid();

  if (approveInvResult) {
    req.flash("notice", `The inventory item was successfully approved.`);
    let nav = await utilities.getNav();
    res.render("./inventory/approve", {
      title: "Manage Inventory Approvals",
      nav,
      pending,
      invPending,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the process failed. Please try again.");
    res.status(501).redirect("/inv/approve");
  }
};

module.exports = invCont;
