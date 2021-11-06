module pskl {
    export module model {
        export module piskel {
            export class Descriptor {
                name: any;
                description: any;
                isPublic: boolean;

                constructor(name, description, isPublic?) {
                    this.name = name;
                    this.description = description;
                    this.isPublic = !!isPublic;
                }
            }
        }
    }
}