"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReunioesDto = void 0;
const class_validator_1 = require("class-validator");
class CreateReunioesDto {
}
exports.CreateReunioesDto = CreateReunioesDto;
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Data invalida!' }),
    __metadata("design:type", Date)
], CreateReunioesDto.prototype, "data_reuniao", void 0);
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Nova data invalida!' }),
    __metadata("design:type", Date)
], CreateReunioesDto.prototype, "nova_data_reuniao", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'justificativa invalida!' }),
    __metadata("design:type", String)
], CreateReunioesDto.prototype, "justificativa_remarcacao", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReunioesDto.prototype, "id_inicial", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateReunioesDto.prototype, "data", void 0);
//# sourceMappingURL=create-reunioes.dto.js.map