import React, { Component, Fragment } from 'react';
import { Button, Modal, Header, Container, Segment, Icon, Form, Table, Label, Pagination, Confirm } from 'semantic-ui-react';
import axios from 'axios';


export class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerList : [],
            id: '',
            name: '',
            address: '',
            newCustomerModal : false,
            editCustomerModal: false,
            deleteCustomerModal: false
        };

        this.getCustomerData = this.getCustomerData.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
    }

    componentDidMount() {
        this.getCustomerData();
    }

    getCustomerData() {
        axios.get('api/Customers').then(response => response.data)
        .then(result => { 
            this.setState({ customerList: result }, () => {console.log(this.state.customerList)});
        },
        (error) => {
            console.log(error);
        }
        )
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        });
    };

    handleAddressChange = e => {
        this.setState({
            address: e.target.value
        });
    };
        
    handleChange(e){
        this.setState({ [e.target.name]: e.target.value })
     };


    addCustomer(e) {
        
        e.preventDefault();
        const user = {
            name: this.state.name,
            address: this.state.address
        };
        axios.post('api/Customers', user)
        .then(res => {
            
            console.log(res);
            
            console.log(res.data);
            const newCustomerList = this.state.customerList.concat(res.data);
            this.setState({customerList: newCustomerList, newCustomerModal: false});
        })
        .catch(err => {
            
            console.log(err)
        } );
    }      
       

    updateCustomer= async() => {
       // console.log('id', this.state.id);
        const user = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address
        };
        console.log(user);

        await axios.put('api/Customers/' + this.state.id, user)
        .then(res => {
           console.log(res);
           console.log(res.data);
           let customerList = this.state.customerList;
           const updatedCustomerList = customerList.map(customer =>  
            { 
                if(customer.id === this.state.id) 
                {
                    customer.name = this.state.name
                    customer.address = this.state.address
                }
            return customer;
        })
        
        this.setState({
               id: this.state.id,
               name: this.state.name,
               address: this.state.address,
               editCustomerModal: false,
               customerList: updatedCustomerList
           });
         
       })
       .catch((error) => console.log( error.response.request._response ) );
    }
            
    initEditForm(customer){
        this.setState({
            editCustomerModal: true,
            id: customer.id,
            name: customer.name,
            address: customer.address,
        })
    }

    initDeleteForm(customer){
        this.setState({
            deleteCustomerModal: true,
            id: customer.id,
            name: customer.name,
            address: customer.address,
        })
    }

    handleCancel = () => this.setState({deleteCustomerModal: false })
    

    deleteCustomer(id) {
        console.log(id);
      const { customerList } = this.state;
      axios.delete('api/Customers/'+ id).then(result =>{
      
      this.setState({
              customerList: customerList.filter(c => c.id !== id),
              deleteCustomerModal: false,
          });
      });
    }

    render = () => {
        let customerList = this.state.customerList;
          return (
            <Fragment>
                <div className="Menubar" style={{ marginTop: "50px"}}>
                <Button
                 onClick={() => this.setState({newCustomerModal: true})} 
                 color="green">New Customer</Button>
                     <Modal 
                        id="modal" 
                        open={this.state.newCustomerModal} 
                        onOpen={() => this.setState({newCustomerModal: true})} 
                        
                        >
                        <Modal.Header >Add a new customer</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.addCustomer}>
                                <Form.Field>
                                    <Label>Name</Label><br />
                                    <input type="text" onChange={this.handleNameChange} value={this.state.name} placeholder="Your Name"
                                    required minLength="3" maxLength="20" /> <br />
                                </Form.Field>
                                <Form.Field>
                                    <Label>Address</Label><br />
                                    <input type="text" placeholder="Your Address" onChange={this.handleAddressChange} value={this.state.address}
                                    required /> <br />
                                </Form.Field>
                                <Button onClick={() => this.setState({newCustomerModal: false})}>Cancel</Button>
                                <Button type="submit" color="blue"><Icon name="save" />Save</Button>
                            </Form>
                        </Modal.Content>
                    </Modal>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Address</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { customerList.map((customer) => {
                                return (<Table.Row key={customer.id}>
                                    <Table.Cell>{customer.name}</Table.Cell>
                                    <Table.Cell>{customer.address}</Table.Cell>
                                    <Table.Cell>
                                    <Button
                                      onClick={() => this.initEditForm(customer)} 
                                      color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                    <Modal 
                                      id="modal" 
                                      open={this.state.editCustomerModal} 
                                      onOpen={() => this.setState({editCustomerModal: true})} 
                                    >
                                    <Modal.Content>
                                        <Form onSubmit={() => this.updateCustomer(customer.id)}>
                                          <Form.Field>
                                                <Label>NAME</Label><br />
                                                <input type="text" name="name" placeholder={customer.name}
                                                onChange={this.handleChange} value={this.state.name} required minLength="3" maxLength="20" /><br />
                                            </Form.Field>
                                            <Form.Field>
                                                <Label>ADDRESS</Label>
                                                <input type="text" name="address" placeholder={customer.address}
                                                onChange={this.handleChange} value={this.state.address} required /><br />
                                            </Form.Field>
                                                <Button onClick={() => this.setState({editCustomerModal: false})}>Cancel</Button>
                                                <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                        </Form>
                                     </Modal.Content>
                                    </Modal>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button 
                                          onClick={() => this.initDeleteForm(customer)}
                                          color="red" ><Icon name="trash"/>Delete
                                        </Button>
                                         <Confirm
                                           open={this.state.deleteCustomerModal}
                                           header='Delete Customer'
                                           onCancel={this.handleCancel}
                                           onConfirm={() => this.deleteCustomer(customer.id)}
                                           size='tiny'
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )})}
                        </Table.Body>
                        
                        <Table.Footer>

                        </Table.Footer>
                    </Table>
                </div>
                </Fragment>
        );
    }
  } 

  