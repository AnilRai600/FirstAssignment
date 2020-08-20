import React, { Fragment } from 'react';
import { Button, Modal, Icon, Form, Table, Label, Confirm } from 'semantic-ui-react';
import axios from 'axios';


export class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeList : [],
            id: '',
            name: '',
            address: '',
            newStoreModal : false,
            editStoreModal: false,
            deleteStoreModal: false
        };

        this.getStoreData = this.getStoreData.bind(this);
        this.addStore = this.addStore.bind(this);
        this.updateStore = this.updateStore.bind(this);
        this.deleteStore = this.deleteStore.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
    }

    componentDidMount() {
        this.getStoreData();
    }

    getStoreData() {
        axios.get('api/Stores').then(response => response.data)
        .then(result => { 
            this.setState({ storeList: result }, () => {console.log(this.state.storeList)});
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


    addStore(e) {
        
        e.preventDefault();
        const storeToAdd = {
            name: this.state.name,
            address: this.state.address
        };
        axios.post('api/Stores', storeToAdd)
        .then(res => {
            
            console.log(res);
            
            console.log(res.data);
            const newStoreList = this.state.storeList.concat(res.data);
            this.setState({storeList: newStoreList, newStoreModal: false});
        })
        .catch(err => {
            
            console.log(err)
        } );
    }      
       

    updateStore= async() => {
       // console.log('id', this.state.id);
        const storeToUpdate = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address
        };
        
        await axios.put('api/Stores/' + this.state.id, storeToUpdate)
        .then(res => {
           console.log(res);
           console.log(res.data);
           let storeList = this.state.storeList;
           const updatedStoreList = storeList.map(store =>  
            { 
                if(store.id === this.state.id) 
                {
                    store.name = this.state.name
                    store.address = this.state.address
                }
            return store;
        })
        
        this.setState({
               id: this.state.id,
               name: this.state.name,
               address: this.state.address,
               editStoreModal: false,
               storeList: updatedStoreList
           });
         
       })
       .catch((error) => console.log( error.response.request._response ) );
    }
            
    initEditForm(store){
        this.setState({
            editStoreModal: true,
            id: store.id,
            name: store.name,
            address: store.address,
        })
    }

    initDeleteForm(store){
        this.setState({
            deleteStoreModal: true,
            id: store.id,
            name: store.name,
            address: store.address,
        })
    }

    handleCancel = () => this.setState({deleteStoreModal: false })
    

    deleteStore(id) {
        console.log(id);
      const { storeList } = this.state;
      axios.delete('api/Stores/'+ id).then(result =>{
      
      this.setState({
              storeList: storeList.filter(s => s.id !== id),
              deleteStoreModal: false,
          });
      });
    }

    render = () => {
        let storeList = this.state.storeList;
          return (
            <Fragment>
                <div className="Menubar" style={{ marginTop: "50px"}}>
                <Button
                 onClick={() => this.setState({newStoreModal: true})} 
                 color="green">New Store</Button>
                     <Modal 
                        id="modal" 
                        open={this.state.newStoreModal} 
                        onOpen={() => this.setState({newStoreModal: true})} 
                        
                        >
                        <Modal.Header >Add a new store</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.addStore}>
                                <Form.Field>
                                    <Label>Name</Label><br />
                                    <input type="text" onChange={this.handleNameChange} value={this.state.name} placeholder="Store Name"
                                    required minLength="3" maxLength="20" /> <br />
                                </Form.Field>
                                <Form.Field>
                                    <Label>Address</Label><br />
                                    <input type="text" placeholder="Store Address" onChange={this.handleAddressChange} value={this.state.address}
                                    required /> <br />
                                </Form.Field>
                                <Button onClick={() => this.setState({newStoreModal: false})}>Cancel</Button>
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
                            { storeList.map((store) => {
                                return (<Table.Row key={store.id}>
                                    <Table.Cell>{store.name}</Table.Cell>
                                    <Table.Cell>{store.address}</Table.Cell>
                                    <Table.Cell>
                                    <Button
                                      onClick={() => this.initEditForm(store)} 
                                      color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                    <Modal 
                                      id="modal" 
                                      open={this.state.editStoreModal} 
                                      onOpen={() => this.setState({editStoreModal: true})} 
                                    >
                                    <Modal.Content>
                                        <Form onSubmit={() => this.updateStore(store.id)}>
                                          <Form.Field>
                                                <Label>NAME</Label><br />
                                                <input type="text" name="name" placeholder={store.name}
                                                onChange={this.handleChange} value={this.state.name} required minLength="3" maxLength="20" /><br />
                                            </Form.Field>
                                            <Form.Field>
                                                <Label>ADDRESS</Label>
                                                <input type="text" name="address" placeholder={store.address}
                                                onChange={this.handleChange} value={this.state.address} required /><br />
                                            </Form.Field>
                                                <Button onClick={() => this.setState({editStoreModal: false})}>Cancel</Button>
                                                <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                        </Form>
                                     </Modal.Content>
                                    </Modal>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button 
                                          onClick={() => this.initDeleteForm(store)}
                                          color="red" ><Icon name="trash"/>Delete
                                        </Button>
                                         <Confirm
                                           open={this.state.deleteStoreModal}
                                           header='Delete Customer'
                                           onCancel={this.handleCancel}
                                           onConfirm={() => this.deleteStore(store.id)}
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

  