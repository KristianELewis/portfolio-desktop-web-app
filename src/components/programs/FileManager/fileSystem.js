
/*=====================================================================

    DATA TYPES
    "Text Editor"
    "PDF Viewer"
    "Image Viewer"
    "Folder"

    Shortcut should potentially be its own class that extends File?
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
        this.data = data;
    }
    toggleProtection () {
        if(this.protection === false){
            this.protection = true;
        }
        else{
            this.protection = false;
        }
    }
    /*=====================================================================

        DELETION SECTION

        This is a much simplier implementation of the Folders deletion section. See the folder deletion section explanation and notes

    =====================================================================*/
    //should have no children to delete 
    deleteSelf() {
        //console.log("Inside delete self, child: " + this.id + " " + this.name)
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
            //console.log("File is protected")
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
        //console.log("Inside delete self, child: " + this.id + " " + this.name)
        this.deleteChildren()
        this.dirty = true;
        this.parent = null
    }
    deleteChild(id) {

        const index = this.children.findIndex((child) => {return child.id === id})
        //console.log("Inside delete child, parent: " + index)
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
            //console.log("Folder is protected")
            return "This is a protected Folder and can not be deleted." //This could be sent to a future terminal program if the delete function was called from there
        }
    }
}


//There probably is a better way to do this. I should refactor this later
//Some things like adding specific file types could be made more generic

//this either needs to be a separate program that generates json or something, or just json.
export const defaultFileSystem = () => {
    const home = new Folder("Home", null, 0, "")
    home.addNewFolder("Desktop");
    home.addNewFolder("Documents");
    home.addNewFolder("Pictures");

    //const backgroundPictureData = {src : "/darkOcean.png", dimensions : {width : 1920, height : 1080}};

    const defaultPictureData = [
        {src : "/darkOcean.png", dimensions : {width : 1920, height : 1080}},
        {src : "/mountain.png", dimensions : {width : 1920, height : 1080}},
        {src : "/beach.png", dimensions : {width : 768, height : 512}},
        {src : "/beach2.png", dimensions : {width : 768, height : 512}},
        {src : "/beach3.png", dimensions : {width : 512, height : 512}},
        {src : "/officeView.png", dimensions : {width : 768, height : 768}},
        {src : "/onTheJob.png", dimensions : {width : 512, height : 512}}
    ]

    home.children[2].addNewFile("Dark Ocean.png", "Image Viewer", defaultPictureData[0]);
    home.children[2].addNewFile("Mountain.png", "Image Viewer", defaultPictureData[1]);
    home.children[2].addNewFile("Beach.png", "Image Viewer", defaultPictureData[2]);
    home.children[2].addNewFile("Beach 2.png", "Image Viewer", defaultPictureData[3]);
    home.children[2].addNewFile("Beach 3.png", "Image Viewer", defaultPictureData[4]);
    home.children[2].addNewFile("Office View.png", "Image Viewer", defaultPictureData[5]);
    home.children[2].addNewFile("On The Job.png", "Image Viewer", defaultPictureData[6]);

    const howToData = [
        {
            type: 'paragraph',
            children: [{ text: `=================================================
Hello and welcome.

Click on a shortcut to start that program.
You can also click on the start menu in the bottom left corner to choose a program.

You can move or resize any program window.

You can change the background picture from the start menu.

If a window fills the screen and you have trouble reszing it, double click on the windows top bar.
This will resize it to a size smaller then the screen.
-------------------------------------------------------------------------------------

A Note on Touch and Mobile Devices

The website supports touch devices but is built to be used with a mouse.
You may encounter bugs if using a touch device!

In the file manager the current path can grow large enough that you may need to scroll through it.
Using a mouse you can move the file manager around while dragging on the path.
A touch device can not move the file manager while touching the path.
This is because touching the path will scroll through the path.
There is a small section to the left of the path that you can use to move the file manager.
=================================================` }],
        },
    ];
    home.children[0].addNewFile("How to use", "Text Editor", howToData);

    const resumePDF = "/Resume.pdf";
    home.children[0].addNewFile("Resume.pdf", "PDF Viewer", resumePDF);

    
    //these should just basically be program shortcuts
    home.children[0].addNewFile("File Manager","File Manager", {
        version : "Standalone", 
        clickFunction : null, 
        requestID : null, 
        requestData : null, 
        acceptableType : null, 
        programHandler : null, 
        requestCanceler : null
    })
    home.children[0].addNewFile("Calorie Counter", "Calorie Counter", null);
    home.children[0].addNewFile("PianoSynthJS", "PianoSynthJS", null);
    home.children[0].addNewFile("Calculator", "Calculator", null);

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
        for(const child_ of child.children)
        {
            child_.toggleProtection()
        }
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

    -The dirty bool could potentially be removed. This might help with lingering data.
        -When a folder or file is deleted all of its values should be set to null.
            -This hasn't been done yet.
            -Could probably find a common value shared by all folders and files, such as id.
                If that value is null than the folder/file was deleted. This would remove the need for the dirty bit

    -Quick access will still refer to deleted folders for some time.
        -I could maybe do something to auto delete it from quick access, not too important at the moment
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

------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
------------------------------------------------------------------------

    PATHING SYSTEM/FILE LOCATION

    -I think eventually this will be the way to navigate the file system
        -I need to research file systems, specifically unix systems, and try to implement something similar
        -I assume the way I will end up doing it here in unoptimized, I can already see ways it can be changed/improved
            -But I can't refactor it right now. I need to get something working and then I can come back and refactor it later
=====================================================================*/