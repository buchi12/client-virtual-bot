import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      input: '',
      customQuery: '',
      showOptions: false,
      showCustomQueryInput: false,
      isTyping: false,
      cancel:'',
    };
  }

  predefinedOptions = [
    "Billing Issues",
    "Bank Balances",
    "Account Queries",
    "Technical issues",
    "For other Queries"
  ];

  randomMessages = {
    "Billing Issues": "hi, your billing is 2020",
    "Bank Balances": "your bank balance is 30,000",
    "Account Queries": "Cotact as 9381911085",
    "Technical issues": "Your maintaing server"
  };

  handleInputChange = (e) => {
    this.setState({ input: e.target.value });
  };

  handleCustomQueryChange = (e) => {
    this.setState({ customQuery: e.target.value });
  };

  handleInputSubmit = async (e) => {
    e.preventDefault();
    const {  messages } = this.state;

   
      this.setState({
      
        messages: [
          ...messages,
          { from: 'bot', text: 'Hello! How can I assist you today?' }
        ],
        showOptions: true,
      });
    

    this.setState({ input: '' });
  };

  handleOptionClick = async (option) => {
    const { messages } = this.state;

    if (option === 'For other Queries') {
      this.setState({
        messages: [...messages, { from: 'bot', text: 'Please enter your query below:' }],
        showCustomQueryInput: true
      });
    } else{ const randomMessage = this.randomMessages[option];
    this.setState({ isTyping: true });
    setTimeout(() => {
      this.setState({
        messages: [...messages, { from: 'user', text: option }, { from: 'bot', text: randomMessage }],
        isTyping: false,
      });
    }, 1000); // Simulate typing delay
  }
  };

  handleCustomQuerySubmit = async (e) => {
    e.preventDefault();
    const { customQuery, messages } = this.state;
    this.setState({ isTyping: true });
    try {

  


      const response = await axios.post('https://virtual-bot-xmxo.onrender.com/api/tickets/create', { query: customQuery });
      setTimeout(() => {
        this.setState({
          messages: [
            ...messages,
            { from: 'user', text: customQuery },
            { from: 'bot', text: `Ticket created successfully with ID: ${response.data.ticket._id}` }
          ],
          customQuery: '',
          showCustomQueryInput: false,
          isTyping: false,
        });
      }, 1000); 
    } catch (error) {
    
      console.error('Error creating ticket:', error);
      this.setState({
        messages: [...messages, { from: 'bot', text: 'There was an error creating your ticket. Please try again later.' }],
        isTyping: false,
    })
  };
  }

cancel=()=>{
  this.setState({cancel:"choose below one"})
}

  render() {
    const { messages, input, customQuery, showOptions, showCustomQueryInput,isTyping } = this.state;

    return (
      <div className="App">
     
        <div className="chat-window">
          <h1 className="head">Hey, Iam your virtual assistant</h1>
        <img class="image" alt="dd" src="https://d1tgh8fmlzexmh.cloudfront.net/ccbp-dynamic-webapps/chatbot-bot-img.png" />
      
      
        {messages.map((msg, index) => (
                 <div key={index} className={msg.from === 'user' ? 'user' : 'bot'}>
                     <p className= '"msg-to-chatbot "'>  {msg.text} </p>
                  
          </div>
          
          ))}
   {isTyping && <div className="typing">Bot is typing...</div>}
{showCustomQueryInput && (

          <form onSubmit={this.handleCustomQuerySubmit}>
            <textarea
              type="text"
              value={customQuery}
              onChange={this.handleCustomQueryChange}
              rows="4" cols="50"
              placeholder="Type your query"
            />
            <div>
            <button type="submit">Submit</button>
        
          
            </div>
          
          </form>
        )}
          
          {showOptions && (
          <div className="options">
            {this.predefinedOptions.map((option, index) => (
              <button key={index} onClick={() => this.handleOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
        )}
    

       
        
    
          </div>
          <div>
         
     
         </div>
         <form onSubmit={this.handleInputSubmit} className="fixed-form">
           <input
             type="text"
             value={input}
             className="input1"
             onChange={this.handleInputChange}
             placeholder="Enter 'test' to start"
           />
           <button type="submit">Submit</button>
         </form>
      </div>
    );
  }
}

export default App;
