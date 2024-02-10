"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectSentry = void 0;
const utils_1 = require("../utils");
const sentry_tokens_1 = require("../sentry.tokens");
exports.InjectSentry = (0, utils_1.createInjectableDecorator)(sentry_tokens_1.SENTRY_TOKEN);
//# sourceMappingURL=sentry.decorator.js.map