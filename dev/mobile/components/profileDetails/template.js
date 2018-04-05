import React from 'react';
import {Field} from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Config from "../../../config/main";
import Loader from "../../components/loader/";
import Countries from "../../../components/countriesList/";
import {t} from "../../../helpers/translator";
import formsNames from '../../../constants/formsNames';
import {getErrorMessageByCode} from '../../../constants/errorCodes';
import PropTypes from "prop-types";

let now = new Date();

// must be defined outside of render method, see redux-form Field(stateless function) documentation
const datePicker = field => <DatePicker
    showYearDropdown
    showMonthDropdown
    selected={field.input.value && moment(field.input.value)}
    maxDate={moment(new Date(new Date(now.getFullYear() - Config.main.regConfig.settings.minYearOld, now.getMonth(), now.getDate()).getTime()))}
    minDate={moment(new Date(new Date(now.getFullYear() - Config.main.regConfig.settings.maxYearOld, now.getMonth(), now.getDate()).getTime()))}
    dateFormat="YYYY-MM-DD"
    dropdownMode="select"
    onChange={field.input.onChange}
/>;

function GenderField ({input, fields}) {
    return (
        <select value={input.value} disabled={fields.gender.readOnly} onChange={input.onChange}>
            <option value="M">{t("Male")}</option>
            <option value="F">{t("Female")}</option>
        </select>
    );
}

GenderField.propTypes = {
    input: PropTypes.object,
    fields: PropTypes.object
};

module.exports = function profileDetailsTemplate () {
    console.debug("detail props", this.props, this.fieldFroperties);
    let errors = (!this.props.pristine && this.props.forms && this.props.forms[formsNames.profileDetailsForm] && this.props.forms[formsNames.profileDetailsForm].syncErrors) || {};
    let fields = this.fieldFroperties;

    let inputField = (name, label, type = "text", readOnly = false) =>
        <div className={"details-form-item-m" + (errors[name] ? " error" : "")}>
            <label>{label}</label>
            <div className="single-form-item">
                <Field component="input" type={type} name={name} readOnly={readOnly}/>
                {errors[name] ? <p className="error-message">{errors[name]}</p> : null}
            </div>
        </div>;

    /**
     * @name displayFailReason
     * @description get changes of user profile details check the result and return corresponding message
     * @param {object} response
     * @returns {Object}
     * */
    function displayFailReason (response) {
        console.log("failreason", response);
        return <div className="error-text-contain">
            <p>{response === "-1002" ? t("Invalid password") : getErrorMessageByCode(response, true, t("Profile cannot be updated right now, please try again later or contact support."))}</p>
        </div>;
    }

    if (this.props.profile) {
        let excludeWhileLangArray = Config.main.personalDetails && Config.main.personalDetails.excludeWhileLang && Config.main.personalDetails.excludeWhileLang[Config.env.lang] || [];
        return <form onSubmit={this.props.handleSubmit(this.save.bind(this))}>
            <div className="my-details-container-m">
                {(fields.id && excludeWhileLangArray.indexOf("id") === -1) ? inputField("id", t("ID"), "text", fields.id.readOnly) : null}
                {(fields.username && excludeWhileLangArray.indexOf("username") === -1) ? inputField("username", t("Username"), "text", fields.username.readOnly) : null}
                {(fields.first_name && excludeWhileLangArray.indexOf("first_name") === -1) ? inputField("first_name", t("First Name"), "text", fields.first_name.readOnly) : null}
                {(fields.last_name && excludeWhileLangArray.indexOf("last_name") === -1) ? inputField("last_name", t("Last Name"), "text", fields.last_name.readOnly) : null}
                {(fields.email && excludeWhileLangArray.indexOf("email") === -1) ? inputField("email", t("E-mail"), "text", fields.email.readOnly) : null}
                {(fields.doc_number && excludeWhileLangArray.indexOf("doc_number") === -1) ? inputField("doc_number", t("Passport Number"), "text", fields.doc_number.readOnly) : null}
                {(fields.iban && excludeWhileLangArray.indexOf("iban") === -1) ? inputField("iban", t("Iban"), "text", fields.iban.readOnly) : null}

                {(fields.birth_date && excludeWhileLangArray.indexOf("birth_date") === -1)
                    ? fields.birth_date.readOnly
                        ? inputField("birth_date", t("Date of Birth"), "text", fields.birth_date.readOnly)
                        : (
                            <div className={"details-form-item-m" + (errors.birth_date ? " error" : "")}>
                                <label>{t("Date of Birth")}</label>
                                <div className="date-picker-wrapper">
                                    <Field name="birth_date" component={datePicker}/>
                                    {errors.birth_date ? <p className="error-message">{errors.birth_date}</p> : null}
                                </div>
                            </div>
                        )
                    : null}
                {(fields.gender && excludeWhileLangArray.indexOf("gender") === -1)
                    ? <div className={"details-form-item-m" + (errors.gender ? " error" : "")}>
                        <label>{t("Gender")}</label>
                        <div className="form-p-i-m">
                            <div className="select-contain-m">
                                <Field name="gender" component={GenderField} fields={fields} />
                                {errors.gender ? <p className="error-message">{errors.gender}</p> : null}
                            </div>
                        </div>
                    </div> : null}

                {(fields.country_code && excludeWhileLangArray.indexOf("country_code") === -1)
                    ? <div className={"details-form-item-m" + (errors.country_code ? " error" : "")}>
                        <label>{t("Country of Residence")}</label>
                        <div className="form-p-i-m">
                            <div className="select-contain-m">
                                <Field name="country_code" component={ field => <Countries selected={field.input.value}
                                                                                           onChange={field.input.onChange}
                                                                                           readOnly={fields.country_code.readOnly}/> }/>
                                {errors.country_code ? <p className="error-message">{errors.country_code}</p> : null}
                            </div>
                        </div>
                    </div> : null}

                {(fields.city && excludeWhileLangArray.indexOf("city") === -1) ? inputField("city", t("City of Residence"), "text", fields.city.readOnly) : null}
                {(fields.address && excludeWhileLangArray.indexOf("address") === -1) ? inputField("address", t("Address"), "text", fields.address.readOnly) : null}
                {(fields.phone && excludeWhileLangArray.indexOf("phone") === -1) ? inputField("phone", t("Phone number"), "tel", fields.phone.readOnly) : null}
                {(fields.password && excludeWhileLangArray.indexOf("password") === -1) ? inputField("password", t("Current Password"), "password", fields.password.readOnly) : null}

                {/*
                 <div className="text-info-p-m">
                 <p>{t("NOTE: To verify your mobile number type it in correctly in the field above, then click on the verify.")}</p>
                 </div>

                 <div className="separator-box-buttons-m">
                 <button className="button-view-normal-m color-progress">{t("Verify")}</button>
                 </div>
                 */}
                {this.props.submitting ? <Loader/> : null}
                <div className="separator-box-buttons-m">
                    <button className="button-view-normal-m"
                            disabled={this.props.submitting || this.props.pristine || !this.props.valid}
                            type="submit">
                        {t("Save Changes")}
                    </button>
                    { this.props.ui.failReason[formsNames.profileDetailsForm] && this.props.submitFailed ? displayFailReason(this.props.ui.failReason[formsNames.profileDetailsForm]) : null}
                    {(this.props.ui.loading[formsNames.profileDetailsForm] === false && !this.props.ui.failReason[formsNames.profileDetailsForm] && this.props.submitSucceeded /** && this.props.pristine **/)
                        ? <div className="success"><p>{t("Profile successfully updated.")}</p></div> : null }
                </div>

            </div>
        </form>;
    } else {
        return <Loader/>;
    }

};
