import { Controller, Post, Body } from '@nestjs/common';
import { InputFileEto } from './etos/input-file.eto';
import { FileEto } from './etos/file.eto';
import { MergerEto } from './etos/merger.eto';
import { InputReader } from './inputreader/input-reader';

@Controller('processmanagement')
export class ProcessmanagementController {
  @Post('/isValidInput')
  isValidInput(@Body() inputFile: InputFileEto) {
    const filename: string = inputFile.filename;
    console.log(filename);
    const validExtensions = ['.nest','.ts'];
    for (let extension of validExtensions) {
      if (filename.includes(extension)) {
        console.log(true);
        return true;
      }
    }
    console.log(false);
    return false;
  }

  @Post('/tsplugin/getInputModel')
  async getInputModel(@Body() inputFile: InputFileEto) {
    const inputReader: InputReader = new InputReader();

    const model = await inputReader.getInputObjects(inputFile.content,true);

    //const parser = new TypescriptParser();
    //const parsedFile = await parser.parseSource(inputFile.content)
    console.log("DEBUG");
    console.log(inputFile.content);

    return model.input;
  }

  @Post('/tsplugin/merge')
  merge(@Body() merger: MergerEto) {
    const patchContent: string = merger.patchContent.replace(/\\n/gm, '\n');
    const baseContent: string = merger.baseContent.replace(/\\n/gm, '\n');
    const patchOverrides: boolean = merger.patchOverrides;

    const tsm = require('@devonfw/ts-merger');
    const mergedCode: string = tsm.merge(
      baseContent,
      patchContent,
      patchOverrides,
    );

    return mergedCode;
  }

  @Post('/tsplugin/beautify')
  beautify(@Body() file: FileEto) {
    const content: string = file.content.replace(/\\n/gm, '\n');

    const beautify = require('js-beautify');
    const beautifiedCode: string = beautify(content);

    return beautifiedCode;
  }
}
