import React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import Json from "circular-json"

const Row = ({intent}) => {
    const style = {
        margin: 5
    }
    return <div style={style}>{intent}</div>
}


@observer
class App extends React.Component{

    @observable intents = []
    @observable currentIntent = ""
    @observable intentName = ""

    @action
    addIntent = () => {
        this.intents.push(this.currentIntent)
        this.currentIntent = ""
    }

    @action
    handleTextChange = (e) => {
        this.currentIntent = e.target.value
    }

    @action
    handleKeyDown = (e, cb) =>{
        if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            cb();
          }
    }

    @action
    handleIntentNameChange = (e) => {
        this.intentName = e.target.value
    }

    downloadFile = () => {
        console.log("Downloading")
        if(this.intentName == ""){
            alert("You must add an intent name before downloading")
            return
        }
        let data = {
                rasa_nlu_data: {
                    common_examples: [],
                    regex_features : [],
                    lookup_tables  : [],
                    entity_synonyms: []
                }            
        }

        for (let intent of this.intents){
            const example = {
                text: intent,
                intent: this.intentName,
                entities: []
            }
            data.rasa_nlu_data.common_examples.push(example)
        }

        console.log(Json.stringify(data))

        this.exportToJson(data)

    }

    exportToJson = (objectData) => {
        let filename = `intent_${this.intentName}.json`;
        let contentType = "application/json;charset=utf-8;";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          var blob = new Blob([decodeURIComponent(encodeURI(Json.stringify(objectData)))], { type: contentType });
          navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          var a = document.createElement('a');
          a.download = filename;
          a.href = 'data:' + contentType + ',' + encodeURIComponent(Json.stringify(objectData));
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }

    

    render(){
        return(
            <div> 
                <div> 
                    <label style={{float: "left"}}> Intent Name: </label>
                    <input onChange={this.handleIntentNameChange}/>
                    <button onClick={this.downloadFile}> Download </button>
                </div>
                <div> 
                <h1> Intents </h1>
                <ul>
                    {this.intents.map( intent => <Row intent={intent}/>)}
                </ul>
                <form
                    onSubmit={this.addIntent}
                    onKeyDown={(e) => { this.handleKeyDown(e, this.addIntent); }}>
                        <div>
                            <label style={{float: "left"}}> Intent Example: </label>
                            <input onChange={this.handleTextChange} value={this.currentIntent}/>
                            <button type="submit" > Add </button>
                        </div>
                </form>
            </div>
            </div>
        )
    }
}

export default App
