import React, { Fragment } from 'react';
import { Button, Modal, Icon, Form, Table, Label,  Confirm } from 'semantic-ui-react';
import axios from 'axios';


export class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            id: '',
            name: '',
            price: '',
            newProductModal : false,
            editProductModal: false,
            deleteProductModal: false
        };

        this.getProductData = this.getProductData.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
        this.initDeleteForm = this.initDeleteForm.bind(this);
    }

    componentDidMount() {
        this.getProductData();
    }

    getProductData() {
        axios.get('api/Products').then(res => res.data)
        .then(result => { 
            this.setState({ productList: result }, () => {console.log(this.state.productList)});
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

    handlePriceChange = e => {
       this.setState({
           price: parseFloat(e.target.value)
       });
    };

    handleBlur(e) {
        let num = parseFloat(this.state.price)
        let cleanNum = num.toFixed(2);
        this.setState({price: cleanNum});
    }

    handleChange(e){
        this.setState({ [e.target.name]: e.target.value })
    };


    addProduct(e) {
        
        e.preventDefault();
        const priceDecimal = parseFloat(this.state.price).toFixed(2);
        
        console.log(typeof(this.state.price));

        
        const productToAdd = {
            name: this.state.name,
            price: priceDecimal
            
        };
        
        axios.post('api/Products', productToAdd ,{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            
            console.log(res);
            
            console.log(res.data);
            
        
            const newProductList = this.state.productList.concat(res.data);
            this.setState({productList: newProductList, newProductModal: false});
        })
        .catch(err => {
            console.log(productToAdd);
            console.log(err)
        } );
    }      
       

    updateProduct= async() => {
    
        const productToUpdate = {
            id: this.state.id,
            name: this.state.name,
            price: this.state.price
        };
         await axios.put('api/Products/' + this.state.id, productToUpdate)
        .then(res => {
           console.log(res);
           console.log(res.data);
           let productList = this.state.productList;
           const updatedProductList = productList.map(product => 
            {
                if(product.id === this.state.id) 
                {
                    product.name = this.state.name
                    product.price = this.state.price
                }
                return product;
            })

           this.setState({
               id: this.state.id,
               name: this.state.name,
               price: this.state.price,
               editProductModal: false,
               productList: updatedProductList,
           });
          
       })
       .catch((error) => console.log( error.response.request._response ) );
    }
            
    initEditForm(product){
        this.setState({
            editProductModal: true,
            id: product.id,
            name: product.name,
            price: product.price,
        })
    }

    initDeleteForm(product){
        this.setState({
            deleteProductModal: true,
            id: product.id,
            name: product.name,
            product: product.price,
        })
    }

    handleCancel = () => this.setState({deleteProductModal: false })
    

    deleteProduct(id) {
        
      const { productList } = this.state;
      axios.delete('api/Products/'+ id).then(result =>{
      
      this.setState({
              productList: productList.filter(p => p.id !== id),
              deleteProductModal: false,
          });
      });
    }

    render = () => {

        let productList = this.state.productList;
        
          return (
            <Fragment>
                <div className="Menubar" style={{ marginTop: "50px"}}>
                <Button
                 onClick={() => this.setState({newProductModal: true})} 
                 color="green">New Product</Button>
                     <Modal 
                        id="modal" 
                        open={this.state.newProductModal} 
                        onOpen={() => this.setState({newProductModal: true})} 
                        
                        >
                        <Modal.Header >Add a new Product</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.addProduct}>
                                <Form.Field>
                                    <Label>Name</Label><br />
                                    <input 
                                        type="text"
                                        onChange={this.handleNameChange} 
                                        value={this.state.name} 
                                        placeholder="Product Name"
                                        required minLength="3" 
                                        maxLength="20" /> <br />
                                </Form.Field>
                                <Form.Field>
                                    <Label>Price</Label><br />
                                    <input 
                                        type="number" 
                                        value={this.state.price}
                                        placeholder="Product Price" 
                                        onChange={this.handlePriceChange}
                                        onBlur={this.handleBlur}
                                        required /> <br />
                                </Form.Field>
                                <Button onClick={() => this.setState({newProductModal: false})}>Cancel</Button>
                                <Button type="submit" color="blue"><Icon name="save" />Save</Button>
                            </Form>
                        </Modal.Content>
                    </Modal>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { productList.map((product) => {
                                return(<Table.Row key={product.id}>
                                    <Table.Cell>{product.name}</Table.Cell>
                                    <Table.Cell><span>$ </span>{product.price}</Table.Cell>
                                    <Table.Cell>
                                    <Button
                                      onClick={() => this.initEditForm(product)} 
                                      color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                    <Modal 
                                      id="modal" 
                                      open={this.state.editProductModal} 
                                      onOpen={() => this.setState({editProductModal: true})} 
                                    >
                                    <Modal.Content>
                                        <Form onSubmit={() => this.updateProduct(product.id)}>
                                          <Form.Field>
                                                <Label>Name</Label><br />
                                                <input type="text" name="name" placeholder={product.name}
                                                onChange={this.handleChange} value={this.state.name} required minLength="3" maxLength="20" /><br />
                                            </Form.Field>
                                            <Form.Field>
                                                <Label>Price</Label>
                                                <input type="number" step="0.01" title="Currency" name="price" placeholder={product.price}
                                                onChange={this.handleChange} value={this.state.price} required /><br />
                                            </Form.Field>
                                                <Button onClick={() => this.setState({editProductModal: false})}>Cancel</Button>
                                                <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                        </Form>
                                     </Modal.Content>
                                    </Modal>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button 
                                          onClick={() => this.initDeleteForm(product)}
                                          color="red" ><Icon name="trash"/>Delete
                                        </Button>
                                         <Confirm
                                           open={this.state.deleteProductModal}
                                           header='Delete Product'
                                           onCancel={this.handleCancel}
                                           onConfirm={() => this.deleteProduct(product.id)}
                                           size='tiny'
                                        />
                                    </Table.Cell>
                                </Table.Row>)
                            })}
                        </Table.Body>
                        
                        <Table.Footer>

                        </Table.Footer>
                    </Table>
                </div>
                </Fragment>
        );
    }
  } 
