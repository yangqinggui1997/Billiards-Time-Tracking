import React from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { SerializationExportType, VESDK } from 'react-native-videoeditorsdk'
import { PESDK } from 'react-native-photoeditorsdk'
import axiosInstance from '../api/axiosConfig'
import DocumentPicker from 'react-native-document-picker'

const RNFS = require('react-native-fs');


let serialization = null

const configuration  = {
	export: {
		serialization: {
			enabled: true,
			exportType: SerializationExportType.OBJECT
		}
	}
}

const ChatScreen = () => {
    const openEditorVideo = () => {
        VESDK.openEditor(require('../../data/user/sample.mp4'), configuration, serialization).then(
            (result) => {
                if(result !== null)
                {
                    serialization = result.serialization
                    
                }
                console.log(result)
            },
            (error) => {
              console.log(error)
            }
        )
    }

    const openEditorImage = () => {
        PESDK.openEditor(require('../../data/user/image.png'), configuration, serialization).then(
            (result) => {
                if(result !== null)
                {
                    if(result.hasChanges)
                    {
                        serialization = result.serialization
                        var formData = new FormData()
                        const headers = {
                            'Content-Type': 'multipart/form-data'
                        }
                        formData.append('image', {uri: result.image, type: result.serialization.image.type, name: result.image.split('/').pop()})
                        axiosInstance.request({method: 'POST', url: '/test/imageEditor', data: formData, headers}).then(response => {
                            console.log(response.data)
                        }).catch(error => {
                            console.log(error.message)
                        })
                    }
                    else
                    {
                        console.log("not change")
                    }

                }
                // console.log(result)
            },
            (error) => {
                console.log(error)
            }
        )
    }

    const selectOneFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            //Printing the log realted to the file
            // console.log('res : ' + JSON.stringify(res));
            // console.log('URI : ' + res.uri);
            // console.log('Type : ' + res.type);
            // console.log('File Name : ' + res.name);
            // console.log('File Size : ' + res.size);
            // const split = res.uri.split('/')
            // const name = split.pop()
            // const inbox = split.pop()
            // const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`
            // console.log(realPath)
            var formData = new FormData()
            const headers = {
                'Content-Type': 'multipart/form-data'
              }
            formData.append('image', res.uri)
            axiosInstance.post('/test/imageEditor', formData, headers).then(response => {
                console.log(response.data)
            }).catch(error => {
                console.log(error.message)
            })
            //Setting the state to show single file attributes
            // setSingleFile(res);
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker')
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err))
                console.log(err.message)
            }
        }
    }

    const selectMultipleFile = async () => {
        //Opening Document Picker for selection of multiple file
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
                //There can me more options as well find above
            });
            for (const res of results) {
                //Printing the log realted to the file
                console.log('res : ' + JSON.stringify(res));
                console.log('URI : ' + res.uri);
                console.log('Type : ' + res.type);
                console.log('File Name : ' + res.name);
                console.log('File Size : ' + res.size);
            }
            //Setting the state to show multiple file attributes
            setMultipleFile(results);
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from multiple doc picker')
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err))
            }
        }
    }

    return (
        <View>
            <Text>This is ChatScreen</Text>
            <Button onPress={openEditorVideo} title="Edit video"/>
            <Button onPress={openEditorImage} title="Edit image"/>
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={selectOneFile}>
                {/*Single file selection button*/}
                <Text style={{ marginRight: 10, fontSize: 19 }}>
                    Click here to pick one file
                </Text>
                <Image
                    source={{
                        uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                    }}
                    style={styles.imageIconStyle}
                />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={selectMultipleFile}>
                {/*Multiple files selection button*/}
                <Text style={{ marginRight: 10, fontSize: 19 }}>
                    Click here to pick multiple files
                </Text>
                <Image
                    source={{
                        uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                    }}
                    style={styles.imageIconStyle}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        backgroundColor: '#fff',
        fontSize: 15,
        marginTop: 16,
        color: 'black',
    },
    buttonStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
        padding: 5,
    },
    imageIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'stretch',
    },
});

export default ChatScreen