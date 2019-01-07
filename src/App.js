import React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import Json from "circular-json"
import { findDOMNode } from 'react-dom'

const Row = ({intent}) => {
    const style = {
        margin: 5
    }
    return (
        <div style={style}>
            {intent.text}
            <ul>
                {intent.entities.map( entity => <li>{`Entity: Value: ${entity.value} |  Name: ${entity.entity}`}</li>)}
            </ul>
        </div>
    )
}


@observer
class App extends React.Component{

    @observable intents = []
    @observable currentIntent = {text: "", entities: []}
    @observable intentName = ""
    @observable currentSelection = {text: "", start: undefined, end: undefined}
    @observable currentEntity = ""

    componentDidMount(){
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection()
      
            if (
                selection.anchorNode
                && selection.anchorNode === this.selectionAnchorNode
            ) {
                this.setSelection(this.inputNode.selectionStart, this.inputNode.selectionEnd)
            }
          }, false)
    }

    @action
    setSelection( start, end ){
        let text = this.inputNode.value.substring(start, end)
        let selection = {
            text,
            start,
            end
        }
        if(selection != ""){
            this.currentSelection = selection
        }
    }

    @action
    handleEntityChange = (e) =>{
        this.currentEntity = e.target.value
    }

    @action
    addIntent = () => {
        this.intents.push(this.currentIntent)
        this.currentIntent = {name: "", entities: []}
        this.currentSelection = {text: "", start: undefined, end: undefined}
    }

    @action
    handleTextChange = (e) => {
        //console.log(e.target.selectionStart)
        this.currentIntent.text = e.target.value
    }

    @action 
    addEntity = () =>{
        let obj = {
            start: this.currentSelection.start,
            end: this.currentSelection.end,
            value: this.currentSelection.text,
            entity: this.currentEntity
        }
        this.currentIntent.entities.push(obj)
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
                ...intent,
                intent: this.intentName,
            }
            data.rasa_nlu_data.common_examples.push(intent)
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

      getSelectionText = () => {
        var text = "";
        var activeEl = document.activeElement;
        var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (
          (activeElTagName == "textarea") || (activeElTagName == "input" &&
          /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
          (typeof activeEl.selectionStart == "number")
        ) {
            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        } else if (window.getSelection) {
            text = window.getSelection().toString();
        }
        console.log(text)
        return text;
    }


    render(){
        console.log(this.currentIntent)
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
                        <div ref={node => this.selectionAnchorNode = node}>
                            <label style={{float: "left"}}> Intent Example: </label>
                            <input 
                                ref={node => this.inputNode = node && findDOMNode(node)}
                                onFocus={this.handleFocus} 
                                onChange={this.handleTextChange} 
                                value={this.currentIntent.text}/>
                            <button type="submit" > Add </button>
                        </div>
                </form>
                <div style={{height: "150px", width: "400px"}}> 
                    { this.currentSelection.text != "" && 
                        <div>
                            <ul>
                                {this.currentIntent.entities.map( entity => <li>{`${entity.entity} = ${entity.value}`}</li>)}
                            </ul>
                            <input
                                onChange={this.handleEntityChange}
                                value={this.currentEntity}
                            />
                           <button onClick={this.addEntity}> {`Add Entity for ${this.currentSelection.text}`}</button>
                        </div>}
                </div>
            </div>
            </div>
        )
    }
}

export default App
