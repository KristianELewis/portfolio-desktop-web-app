


export class File {
    constructor(name, parent, id, prevPath, type) {
        this.name = name;
        this.parent = parent;
        this.type = type;
        this.id = id;
        this.fullPath = prevPath + "/" + name;
        this.data = [
            {
              type: 'paragraph',
              children: [{ text: 'init' }],
            },
          ]
    }

    //don't think I need this anymore
    assignID (ID)
    {
        this.ID = ID;
    } 
    /*deleteSelf () {
        //needs to call revokeUrl on its url
        //don't think javascript has
    }

    */
}

//parent folder needed?

export class Folder {
    constructor(name, parent, id, prevPath) {
        this.name = name;
        this.parent = parent;
        this.id = id;
        this.children = [];
        this.type = "Folder";
        this.nextId = 0;
        this.fullPath = prevPath + "/" + name;
    }

    addNewFolder (name) {
        let child = new Folder(name, this, this.nextId, this.fullPath)
        this.children = [...this.children, child]
        this.nextId =  this.nextId += 1;
    }

    addNewTxtFile (name, type) {
        let child = new File(name, this, this.nextId, this.fullPath, type)
        this.children = [...this.children, child]
        this.nextId =  this.nextId += 1;
    }


    traverse(id)
    {
        for(let i = 0; i < this.children.length; i++)
        {
            if(this.children[i].id  === id)
            {
                return this.children[i]
            }
        }
    }

    raverse() //don't think this is being used any more
    {
        return this.parent;
    }
    //need a delete child here
    /*deleteChild (childName) {

        //loop through children until child with name = childName is found
        //have child Delete its children
        //then delete the child

    }
    */
}


