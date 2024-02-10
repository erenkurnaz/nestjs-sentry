"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInjectableDecorator = void 0;
const common_1 = require("@nestjs/common");
const createInjectableDecorator = (token) => () => (0, common_1.Inject)(token);
exports.createInjectableDecorator = createInjectableDecorator;
//# sourceMappingURL=create-injectable-decorator.js.map