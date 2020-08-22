

const isFile = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("File.")
        }, 1000);
    })
    
}

const readFiles = async () => {
    const files = [1, 2, 3, 4, 5];

    for(const index of files.keys()) {
        await isFile();
        //console.log(file);
        console.log(index);
    }
    console.log('completed.')
}



readFiles()

console.log('-----END-----')