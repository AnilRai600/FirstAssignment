import React, { Component, Fragment } from 'react';
import { Button, Modal, Dropdown, Icon, Form, Table, Label, Pagination, Confirm } from 'semantic-ui-react';
import axios from 'axios';



export class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saleList: [],
            id: '',
            customer: '',
            product: '',
            store: '',
            date: '',
            customerListData: [],
            selectedCustomer: null,
            productListData: [],
            selectedProduct: null,
            storeListData: [],
            selectedStore: null,
            newStoreModal: false,
            editStoreModal: false,
            deleteStoreModal: false
        };

        this.getSaleData = this.getSaleData.bind(this);
        this.getCustomerData = this.getCustomerData.bind(this);
        this.getProductData = this.getProductData.bind(this);
        this.getStoreData = this.getStoreData.bind(this);
        this.addSale = this.addSale.bind(this);
        // this.updateStore = this.updateStore.bind(this);
        // this.deleteStore = this.deleteStore.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        this.initEditForm = this.initEditForm.bind(this);
    }

    componentDidMount() {
        this.getSaleData();
        this.getCustomerData();
        this.getProductData();
        this.getStoreData();

    }

    getSaleData() {
        axios.get('api/Sales').then(response => response.data)
            .then(result => {
                this.setState({ saleList: result }, () => { console.log(this.state.saleList) });
            },
                (error) => {
                    console.log(error);
                }
            )
    }



    getCustomerData() {
        axios.get('api/Customers').then(response => response.data)
            .then(result => {
                this.setState({ customerListData: result });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    getProductData() {
        axios.get('api/Products').then(res => res.data)
            .then(result => {
                this.setState({ productListData: result });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    getStoreData() {
        axios.get('api/Stores').then(response => response.data)
            .then(result => {
                this.setState({ storeListData: result });
            },
                (error) => {
                    console.log(error);
                }
            )
    }

    handleDateChange = e => {
        this.setState({
            date: e.target.value
        })
    }

    handleCustomerDataChange = (e, data) => {
        console.log(`Customer id=${data.value} `);
        this.setState({ selectedCustomer: data.value });
    }


    handleProductDataChange = (e, data) => {
        console.log(`Product id=${data.value} `);
        this.setState({ selectedProduct: data.value });
    }

    handleStoreDataChange = (e, data) => {
        console.log(`Store id=${data.value} `);
        this.setState({ selectedStore: data.value });
    }


    getSaleIndividualData(id) 
    {
        axios.get('api/Sales/' + id).then(response => { 
                const newSaleList = this.state.saleList.concat(response.data);
                this.setState({ saleList: newSaleList, newSaleModal: false });
             },
            (error) => {
                console.log(error);
            })
    }

    addSale(e) {

        e.preventDefault();
        const salesToAdd = {
            DateSold: this.state.date,
            customerId: this.state.selectedCustomer,
            productId: this.state.selectedProduct,
            storeId: this.state.selectedStore
        };

        console.log(salesToAdd);

        axios.post('api/Sales', salesToAdd)
            .then(res => {

                console.log(res);

                console.log(res.data);

                this.getSaleIndividualData(res.data.id);
             })
            .catch(err => {

                console.log(err)
            });


    }


    updateSale = async () => {
        
        const salesToUpdate = {
            id: this.state.id,
            DateSold: this.state.date,
            customerId: this.state.selectedCustomer,
            productId: this.state.selectedProduct,
            storeId: this.state.selectedStore
        };
        console.log(salesToUpdate);

        await axios.put('api/Sales/' + this.state.id, salesToUpdate)
            .then(res => {
                console.log(res);
                console.log(res.data);
                let saleList = this.state.saleList;
                const updatedSaleList = saleList.map(sale => {
                    if (sale.id === this.state.id) {
                        sale.customer.name = this.state.selectedCustomer.name
                        sale.product.name = this.state.selectedProduct.name
                        sale.store.name = this.state.selectedStore.name
                        sale.dateSold = this.state.date
                    }
                    return sale;
                })
                

                

                this.setState({
                    id: this.state.id,
                    customer: this.state.selectedCustomer.name,
                    product: this.state.selectedProduct.name,
                    store: this.state.selectedStore.name,
                    dateSold: this.state.date,
                    editSaleModal: false,
                    saleList: updatedSaleList
                });

            })
            .catch((error) => console.log(error.response.request._response));
    }

    initEditForm(sale) {
        this.setState({
            editSaleModal: true,
            id: sale.id,
            customer: sale.customer,
            product: sale.product,
            store: sale.store,
            dateSold: sale.date,
        })
    }

    initDeleteForm(sale) {
        this.setState({
            deleteSaleModal: true,
            id: sale.id,
            customer: sale.customer,
            product: sale.product,
            store: sale.store,
            dateSold: sale.date,
        })
    }

    handleCancel = () => this.setState({ deleteSaleModal: false })


    deleteSale(id) {
        console.log(id);
        const { saleList } = this.state;
        axios.delete('api/Sales/' + id).then(result => {

            this.setState({
                saleList: saleList.filter(sale => sale.id !== id),
                deleteSaleModal: false,
            });
        });
    }

    render = () => {
        let customerListData = this.state.customerListData;
        let productListData = this.state.productListData;
        let storeListData = this.state.storeListData;
        let saleList = this.state.saleList;
        return (
            <Fragment>
                <div className="Menubar" style={{ marginTop: "50px" }}>
                    <Button
                        onClick={() => this.setState({ newSaleModal: true })}
                        color="green">New Sale</Button>
                    <Modal
                        id="modal"
                        open={this.state.newSaleModal}
                        onOpen={() => this.setState({ newSaleModal: true })}

                    >
                        <Modal.Header >Add a new sale</Modal.Header>
                        <Modal.Content>
                            <Form onSubmit={this.addSale}>
                                <Form.Field>
                                    <Label>Date sold</Label><br />
                                    <input type="date" onChange={this.handleDateChange} value={this.state.date} placeholder="YYYY-MM-DD"
                                        defaultValue={this.state.saleList.date} required /> <br />
                                </Form.Field>
                                <Form.Field>
                                    <Label>Customer</Label><br />
                                    <Dropdown

                                        options={customerListData.map(customer => {
                                            return {
                                                key: customer.id,
                                                text: customer.name,
                                                value: customer.id
                                            }
                                        })}
                                        placeholder='Customer Name'
                                        onChange={this.handleCustomerDataChange}
                                        value={this.state.selectedCustomer}
                                        selection /> <br />
                                </Form.Field>
                                <Form.Field>
                                    <Label>Product</Label><br />
                                    <Dropdown
                                        clearable
                                        options={productListData.map(product => {
                                            return {
                                                key: product.id,
                                                text: product.name,
                                                value: product.id
                                            }
                                        })}
                                        placeholder='Product Name'
                                        onChange={this.handleProductDataChange}
                                        value={this.state.selectedProduct}
                                        selection /> <br />
                                </Form.Field>
                                <Form.Field>
                                    <Label>Store</Label><br />
                                    <Dropdown
                                        clearable
                                        options={storeListData.map(store => {
                                            return {
                                                key: store.id,
                                                text: store.name,
                                                value: store.id
                                            }
                                        })}
                                        placeholder='Store Name'
                                        onChange={this.handleStoreDataChange}
                                        value={this.state.selectedStore}
                                        selection /> <br />
                                </Form.Field>
                                <Button onClick={() => this.setState({ newCustomerModal: false })}>Cancel</Button>
                                <Button type="submit" color="blue" ><Icon name="save" />Save</Button>
                            </Form>
                        </Modal.Content>
                    </Modal>

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Customer</Table.HeaderCell>
                                <Table.HeaderCell>Product</Table.HeaderCell>
                                <Table.HeaderCell>Store</Table.HeaderCell>
                                <Table.HeaderCell>Date Sold</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {saleList.map((sale) => {
                                return (<Table.Row key={sale.id}>
                                    <Table.Cell>{sale.customer.name}</Table.Cell>
                                    <Table.Cell>{sale.product.name}</Table.Cell>
                                    <Table.Cell>{sale.store.name}</Table.Cell>
                                    <Table.Cell>{sale.dateSold}</Table.Cell>
                                    <Table.Cell>
                                    <Button
                                        onClick={() => this.initEditForm(sale)}
                                        color="yellow"><Icon name="edit" />Edit
                                    </Button>
                                        <Modal
                                            id="modal"
                                            open={this.state.editSaleModal}
                                            onOpen={() => this.setState({ editSaleModal: true })}
                                        >
                                            <Modal.Content>
                                                <Form onSubmit={() => this.updateSale(sale.id)}>
                                                    <Form.Field>
                                                        <Label>Date sold</Label><br />
                                                        <input type="date" onChange={this.handleDateChange} value={this.state.date} placeholder="YYYY-MM-DD"
                                                            defaultValue={this.state.saleList.date} required /> <br />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <Label>Customer</Label><br />
                                                        <Dropdown

                                                            options={customerListData.map(customer => {
                                                                return {
                                                                    key: customer.id,
                                                                    text: customer.name,
                                                                    value: customer.id
                                                                }
                                                            })}
                                                            placeholder={sale.customer.name}
                                                            onChange={this.handleCustomerDataChange}
                                                            value={this.state.selectedCustomer}
                                                            selection /> <br />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <Label>Product</Label><br />
                                                        <Dropdown
                                                            clearable
                                                            options={productListData.map(product => {
                                                                return {
                                                                    key: product.id,
                                                                    text: product.name,
                                                                    value: product.id
                                                                }
                                                            })}
                                                            placeholder={sale.product.name}
                                                            onChange={this.handleProductDataChange}
                                                            value={this.state.selectedProduct}
                                                            selection /> <br />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <Label>Store</Label><br />
                                                        <Dropdown
                                                            clearable
                                                            options={storeListData.map(store => {
                                                                return {
                                                                    key: store.id,
                                                                    text: store.name,
                                                                    value: store.id
                                                                }
                                                            })}
                                                            placeholder={sale.store.name}
                                                            onChange={this.handleStoreDataChange}
                                                            value={this.state.selectedStore}
                                                            selection /> <br />
                                                    </Form.Field>
                                                    <Button onClick={() => this.setState({ editSaleModal: false })}>Cancel</Button>
                                                    <Button type="submit" color="blue"><Icon name="save" />Edit</Button>
                                                </Form>
                                            </Modal.Content>
                                        </Modal>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            onClick={() => this.initDeleteForm(sale)}
                                            color="red" ><Icon name="trash" />Delete
                                        </Button>
                                        <Confirm
                                            open={this.state.deleteSaleModal}
                                            header='Delete Sale'
                                            onCancel={this.handleCancel}
                                            onConfirm={() => this.deleteSale(sale.id)}
                                            size='tiny'
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                )
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

