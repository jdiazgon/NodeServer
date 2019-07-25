import { TypescriptParser } from 'typescript-parser/TypescriptParser';
import { InterfaceDeclaration } from 'typescript-parser/declarations/InterfaceDeclaration';
import { ClassDeclaration } from 'typescript-parser/declarations/ClassDeclaration';
import { ModelEto } from './../etos/model.eto';
import { PropertyDeclaration } from 'typescript-parser/declarations/PropertyDeclaration';

export class InputReader {
  readonly path: string;

  public async getInputObjects(path: string) {
    const parser = new TypescriptParser();
    const parsedFile = await parser.parseFile(path, 'blank');

    console.log(parsedFile);

    parsedFile.declarations.forEach(declaration => {
      if (declaration instanceof InterfaceDeclaration) {
        const interfaceDeclaration: InterfaceDeclaration = declaration;
        this.getProperties(interfaceDeclaration.properties);

        const model: ModelEto = new ModelEto(JSON.stringify(parsedFile));

        console.log('RESULT FROM PARSER:\n');
        console.log(model);

        return model;
      } else if (declaration instanceof ClassDeclaration) {
        console.log('Hooray');
      }
    });

    return '';
  }

  private getProperties(properties: PropertyDeclaration[]) {
    properties.forEach(element => {
      console.log(element.name);
    });
  }
}
