import { compileI7 } from "services/compilers/inform7CompilerService";

import ProjectService from "../ProjectService.class";
import projectStore, { ProjectStoreState } from "stores/projectStore";
import materialsStore from "stores/materialsStore";
import { MaterialsFileType } from "types/enum";
import ProjectTemplate from "../ProjectTemplate.class";


/**
 * Initialize an Inform 7 project
 */
export default abstract class Inform7ProjectService extends ProjectService {
    public compile = compileI7;
    public compilerReportType: "staged" = "staged";  // this looks silly, but without the "staged" type, Typescript can't make the connection to the type in the parent class
    public language = "inform7";
    public name = "Inform 7";
    public showFilesystemCompilerOptions = false;   // I7 always has the same entry point and no include paths

    public generateUUIDFile(): void {
        const { uuid } = projectStore;

        // already exists, don't duplicate
        if( materialsStore.findByFullPath( "/uuid.txt" ) ) {
            return;
        }

        materialsStore.addMaterialsFile(
            uuid,
            {
                name: "uuid.txt",
                locked: true,
                type: MaterialsFileType.text
            }
        );
    }

    public initProject = async( template?: ProjectTemplate ): Promise<void> => {
        const initSuccess = await this.init( template );

        if( initSuccess ) {
            this.generateUUIDFile();
            projectStore.setReady();
        }
        else {
            projectStore.setState( ProjectStoreState.error );
        }
    }
}
