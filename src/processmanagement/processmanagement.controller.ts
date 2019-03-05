import { Controller, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';

@Controller('processmanagement')
export class ProcessmanagementController {
  @Post('/isValidInput')
  isValidInput(@Body() inputFile: InputFileEto) {
    const path: string = inputFile.path;
    // console.log(path);
    if (path.includes('.nest')) {
      return true;
    }
    return false;
  }
}
