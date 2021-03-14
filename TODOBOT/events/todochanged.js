module.exports = async (client, todoobj) => { 
    console.log('Todochanged Event')
    console.log(todoobj);
    console.log(todoobj.shared ?? null)
    //if (!todoobj.shared) return;
    if (!todoobj.shared) {
        // update the according read only message
        console.log("yay")
    }
};