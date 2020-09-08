import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { SinkValidateResource } from "twilio/lib/rest/events/v1/sink/sinkValidate";

@ValidatorConstraint({name:'customDate', async:false})
export class CustomDateValidator implements ValidatorConstraintInterface{

    validate(text:string, args: ValidationArguments){
        let regex = /^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/
        if(text.match(regex))
            return true;
        return false;

    }
}