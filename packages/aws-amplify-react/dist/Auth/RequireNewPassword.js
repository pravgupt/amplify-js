'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _awsAmplify = require('aws-amplify');

var _AuthPiece2 = require('./AuthPiece');

var _AuthPiece3 = _interopRequireDefault(_AuthPiece2);

var _AmplifyTheme = require('../AmplifyTheme');

var _AmplifyTheme2 = _interopRequireDefault(_AmplifyTheme);

var _AmplifyUI = require('../AmplifyUI');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _awsAmplify.Logger('RequireNewPassword'); /*
                                                            * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
                                                            *
                                                            * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
                                                            * the License. A copy of the License is located at
                                                            *
                                                            *     http://aws.amazon.com/apache2.0/
                                                            *
                                                            * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
                                                            * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
                                                            * and limitations under the License.
                                                            */

var RequireNewPassword = function (_AuthPiece) {
    (0, _inherits3.default)(RequireNewPassword, _AuthPiece);

    function RequireNewPassword(props) {
        (0, _classCallCheck3.default)(this, RequireNewPassword);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RequireNewPassword.__proto__ || Object.getPrototypeOf(RequireNewPassword)).call(this, props));

        _this._validAuthStates = ['requireNewPassword'];
        _this.change = _this.change.bind(_this);
        _this.checkContact = _this.checkContact.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(RequireNewPassword, [{
        key: 'checkContact',
        value: function checkContact(user) {
            var _this2 = this;

            _awsAmplify.Auth.verifiedContact(user).then(function (data) {
                if (!_awsAmplify.JS.isEmpty(data.verified)) {
                    _this2.changeState('signedIn', user);
                } else {
                    user = Object.assign(user, data);
                    _this2.changeState('verifyContact', user);
                }
            });
        }
    }, {
        key: 'change',
        value: function change() {
            var _this3 = this;

            var user = this.props.authData;
            var password = this.inputs.password;
            var requiredAttributes = user.challengeParam.requiredAttributes;

            _awsAmplify.Auth.completeNewPassword(user, password, requiredAttributes).then(function (user) {
                logger.debug('complete new password', user);
                if (user.challengeName === 'SMS_MFA') {
                    _this3.changeState('confirmSignIn', user);
                } else if (user.challengeName === 'MFA_SETUP') {
                    logger.debug('TOTP setup', user.challengeParam);
                    _this3.changeState('TOTPSetup', user);
                } else {
                    _this3.checkContact(user);
                }
            }).catch(function (err) {
                return _this3.error(err);
            });
        }
    }, {
        key: 'showComponent',
        value: function showComponent(theme) {
            var _this4 = this;

            var hide = this.props.hide;

            if (hide && hide.includes(RequireNewPassword)) {
                return null;
            }

            return _react2.default.createElement(
                _AmplifyUI.FormSection,
                { theme: theme },
                _react2.default.createElement(
                    _AmplifyUI.SectionHeader,
                    { theme: theme },
                    _awsAmplify.I18n.get('Change Password')
                ),
                _react2.default.createElement(
                    _AmplifyUI.SectionBody,
                    null,
                    _react2.default.createElement(_AmplifyUI.InputRow, {
                        autoFocus: true,
                        placeholder: _awsAmplify.I18n.get('New Password'),
                        theme: theme,
                        key: 'password',
                        name: 'password',
                        type: 'password',
                        onChange: this.handleInputChange
                    }),
                    _react2.default.createElement(
                        _AmplifyUI.ButtonRow,
                        { theme: theme, onClick: this.change },
                        _awsAmplify.I18n.get('Change')
                    )
                ),
                _react2.default.createElement(
                    _AmplifyUI.SectionFooter,
                    { theme: theme },
                    _react2.default.createElement(
                        _AmplifyUI.Link,
                        { theme: theme, onClick: function onClick() {
                                return _this4.changeState('signIn');
                            } },
                        _awsAmplify.I18n.get('Back to Sign In')
                    )
                )
            );
        }
    }]);
    return RequireNewPassword;
}(_AuthPiece3.default);

exports.default = RequireNewPassword;