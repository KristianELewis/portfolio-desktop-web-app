


export class File {
    constructor(name, parent, ID, prevPath, type) {
        this.name = name;
        this.parent = parent;
        this.type = type;
        this.ID = ID;
        this.fullPath = prevPath + "/" + name;
        this.data = [
            {
              type: 'paragraph',
              children: [{ text: 'init' }],
            },
          ]
    }

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
    constructor(name, parent, ID, prevPath) {
        this.name = name;
        this.parent = parent;
        this.ID = ID;
        this.children = [];
        this.type = "Folder";
        this.nextID = 0;
        this.fullPath = prevPath + "/" + name;
    }

    addNewFolder (name) {
        let child = new Folder(name, this, this.nextID, this.fullPath)
        this.children = [...this.children, child]
        this.nextID =  this.nextID += 1;
    }

    addNewTxtFile (name, type) {
        let child = new File(name, this, this.nextID, this.fullPath, type)
        this.children = [...this.children, child]
        this.nextID =  this.nextID += 1;
    }

    assignID (ID)
    {
        this.ID = ID;
    } 

    traverse(ID)
    {
        for(let i = 0; i < this.children.length; i++)
        {
            if(this.children[i].ID  === ID)
            {
                return this.children[i]
            }
        }
    }

    raverse()
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


