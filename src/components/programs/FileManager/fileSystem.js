/*=====================================================================

    DELETION SECTION

    This is a much simplier implementation of the Folders deletion section. See the folder deletion section explanation and notes

=====================================================================*/

export class File {
    constructor(name, parent, id, prevPath, type, data) {
        this.name = name;
        this.parent = parent;
        this.type = type;
        this.id = id;
        this.fullPath = prevPath + "/" + name;
        this.protection = false;
        this.dirty = false;
        //The only reason this is like this is because of the default text editor data
        //It should just be provided and this if statement removed
        if (type === "Text Editor"){
            this.data = [
                {
                    type: 'paragraph',
                    children: [{ text: 'init' }],
                },
            ]
        }
        //Probably should just use an else statement here or something. Maybe eventually just git rid of this
        //if else block. Just pass init data down
        else if(type === "PDF Viewer") {
            this.data = data
        }
        else if(type === "Image Viewer") {
            this.data = data
        }
        else{
            this.data = null
        }
    }


    toggleProtection () {
        if(this.protection === false){
            this.protection = true;
        }
        else{
            this.protection = false;
        }
    }

    //don't think I need this anymore
    /*assignID (ID)
    {
        this.ID = ID;
    } */

    /*=====================================================================

        DELETION SECTION

        This is a much simplier implementation of the Folders deletion section. See the folder deletion section explanation and notes

    =====================================================================*/

    //should have no children to delete 
    deleteSelf() {
        console.log("Inside delete self, child: " + this.id + " " + this.name)
        this.dirty = true;
        this.parent = null
    }
    beginSelfDeletion()
    {
        if(this.parent !== null && this.protection === false)
        {
            this.parent.deleteChild(this.id)
        }
        else{
            console.log("File is protected")
            return "This is a protected File and can not be deleted."
        }
    }
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
        this.protection = false;
        this.dirty = false;
    }

    addNewFolder (name) {
        let child = new Folder(name, this, this.nextId, this.fullPath)
        this.children = [...this.children, child]
        this.nextId =  this.nextId += 1;
    }

    //this can just be generic file
    addNewFile (name, type, data) {
        let child = new File(name, this, this.nextId, this.fullPath, type, data)
        this.children = [...this.children, child]
        this.nextId =  this.nextId += 1;
    }

    toggleProtection () {
        if(this.protection === false){
            this.protection = true;
        }
        else{
            this.protection = false;
        }
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

    /*=====================================================================

        DELETION SECTION

        -The majority of my object oreinted expeirence is in c++
        -I'm not used to garbage collection languages
        -I'm used to manually deallocating data.
        -I made this section with that in mind
        -I remove all references of the deleted data and its children.
            -its children will reference it as a parent, So i remove those references as well, even though its child should be unreachable
            -Its childrens will go through the same process
                -I'm unsure how much effect this has on the garbage collect or if its necessary, but I'm compelled to delete the objects this way
                    from both previously developed habits and with the hope it will help the garbage collector remove unreferenced data

        THERE IS AN ISSUES SECTION AT THE BOTTOM OF THE FILE

        
    =====================================================================*/
    deleteChildren(){

        for(const child of this.children)
        {
            child.deleteSelf()
        }
        this.children = null
    }
    deleteSelf() {
        console.log("Inside delete self, child: " + this.id + " " + this.name)
        this.deleteChildren()
        this.dirty = true;
        this.parent = null
    }
    deleteChild(id) {

        const index = this.children.findIndex((child) => {return child.id === id})
        console.log("Inside delete child, parent: " + index)
        this.children[index].deleteSelf()
        
        const newChildren = this.children.filter((child) => {
            if(child.id !== id)
            {
                return child
            }
        })
        this.children = newChildren
    }
    //This one is called from the context menu delete folder option
    beginSelfDeletion()
    {
        //The only time it should be null is if the folder is the home folder, which should not be deleted anyway
        if(this.parent !== null && this.protection === false) //This should hopefully always be true in the apps current state. Files/folders with deletion protection should have the delete option disabled
        {
            this.parent.deleteChild(this.id)
        }
        else{
            console.log("Folder is protected")
            return "This is a protected Folder and can not be deleted." //This could be sent to a future terminal program if the delete function was called from there
        }
    }

    /*
        raverse() //don't think this is being used any more
        {
            return this.parent;
        }
    */



}

export const defaultFileSystem = () => {
    const home = new Folder("Home", null, 0, "")
    home.addNewFolder("Desktop");
    home.addNewFolder("Documents");
    home.addNewFolder("Pictures");

    //This will be implented when fileManager functionality is improved
    //home.addNewFolder("Recent");
    //This will be implemented if/when a File Downloader program is made
    //home.addNewFolder("Downloads");
    //This might be impleneted when deleting files is implemented
    //home.addNewFolder("Trash");


    //Since not many things will be protected, its easier to just assume everything is not protected at first and then toggle its protection
    home.toggleProtection();
    for(const child of home.children)
    {
        child.toggleProtection()
    }
    return home;
}


/*=====================================================================

    UNSORTED NOTES/IMPROVEMENTS

    -at the moment there is no functionality for handling an app that is open to a file that is deleted.
        -It is not causing any major bugs
        -The worst bug is that text editors open to a deleted object will continue to save to the deleted object, but you can only
            access that object from that program, or any other program current loaded with that file
            -It really should give the option to save as a new file instead
            -I may want to separate functionality of save as new file, and save to current file
            -This can wait to be fixed until then.
        -Besides general bugs, this is likely causing memory issues. Again This is not a big deal at the moment and will be addressed after more important
            goals have been reached

------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
------------------------------------------------------------------------

    MEMORY ISSUES

    -Using the memory snapshot option in googlechrome devtools, The deleted file seems to remain (atleast for some time), but all its children are deleted
        -interestingly it seems a deleted object will remain when a file manager is still viewing its parent folder
            -a side effect of this is that any object on the desktop that is deleted will remain in memory, even though it is unreachable
            -okay not sure about that anymore
    
    -at the moment the lingering files seem to be folder with children in the desktop folder
        -folders without children do not seem to have this issue
        -for folders in the file manager, changing folders or closing the file manager seems to help remove the items
        -Only one folder in the Desktop lingered indefenitly, It was the first nested folder deleted

    POTENTIAL FIXES 

    -all of the data of a delted object should be set to null
        -It will hopefully help the garbage collector remove the data of the deleted object
        -Some of this data, such as fullPath, references data from parent folders
            -this may be causing issues
    
    -The Desktop could refresh its view on a deletion

------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
------------------------------------------------------------------------

    NOTES

    -Protection will only be checked in beginSelfDeletion
        -I dont think its worth it to check in the other delete functions
        -If those function are called the parent folder is being deleted,
        -No unprotected folders should have protected files/folders at the moment
        -the protected file/folder will be unreachable anyway
        -In the future, If I allow the user to toggle protection of files/folders, if a child becomes protect its parent folder should as well

    -In another test there were no lingering files after a few more folder creations and deletions

    -Google dev tools has a collect garbage button.
        -I wonder if there is a way to call garbage collection

    -every time a file manager is opened .2MB of data is created that seem to be perstent, even after the file manager closes
        -This must be a part of process management, but what is staying? is it the program counter and z index counter?

    -These potential memory leaks should be investigated once the majority of the apps short term goals are realized
        -Its not enough to cause issue with casual use at the moment

    -The arrays for previous folder or next folder will still reference delted files
        -This is likely the cause of some of the lingering behavoir noticed, especially since some of that behavoir was fixed by closing the fle manager
        -this should be a very serious issue
            -The file manager should check if the forward or backward folder is deleted
                -if the forward or backward folder is deleted then it should set that array to an empty array and inform the user it is deleted

=====================================================================*/