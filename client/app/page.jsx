"use client"
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getActor, login, logout, isAuthenticated, getPrincipal } from './config/dfinity';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [shipmentCount, setShipmentCount] = useState(0);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    async function initialize() {
      await checkAuth();
    }
    initialize();
  }, []);

  const checkAuth = async () => {
    const authStatus = await isAuthenticated();
    setLoggedIn(authStatus);
    if (authStatus) {
      const principal = await getPrincipal();
      setPrincipal(principal);
      await fetchData();
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const actor = await getActor();

      const [products, shipments, pCount, sCount] = await Promise.all([
        actor.getProducts(),
        actor.getShipments(),
        actor.getProductCount(),
        actor.getShipmentCount()
      ]);

      setProducts(products);
      setShipments(shipments);
      setProductCount(pCount);
      setShipmentCount(sCount);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch data. Please try again.',
        icon: 'error',
        willClose: () => handleLogout()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      await checkAuth();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Logged in successfully',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Login failed. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLoggedIn(false);
      setPrincipal(null);
      setProducts([]);
      setShipments([]);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Logged out successfully',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Logout failed. Please try again.', 'error');
    }
  };

  const handleAddProduct = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Product',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Product Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Manufacturer">' +
        '<textarea id="swal-input3" class="swal2-textarea" placeholder="Description"></textarea>',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ];
      }
    });

    if (formValues) {
      try {
        setLoading(true);
        const actor = await getActor();
        const [name, manufacturer, description] = formValues;
        const result = await actor.addProduct(name, description);
        Swal.fire('Success', result.Success, 'success');
        await fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to add product', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddShipment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Shipment',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Product ID">' +
        '<input id="swal-input2" class="swal2-input" placeholder="From">' +
        '<input id="swal-input3" class="swal2-input" placeholder="To">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ];
      }
    });

    if (formValues) {
      try {
        setLoading(true);
        const actor = await getActor();
        const [productId, from, to] = formValues;
        const result = await actor.addShipment(productId, from, to);
        // Handle the Message type response
        if ('Success' in result) {
          Swal.fire('Success', result.Success, 'success');
        } else if ('NotFound' in result) {
          Swal.fire('Not Found', result.NotFound, 'error');
        } else if ('Unauthorized' in result) {
          Swal.fire('Unauthorized', result.Unauthorized, 'warning');
        } else {
          Swal.fire('Error', 'Unknown response from canister', 'error');
        }
        await fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to add shipment', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateShipmentStatus = async (shipmentId) => {
    const { value: status } = await Swal.fire({
      title: 'Update Shipment Status',
      input: 'select',
      inputOptions: {
        'CREATED': 'Created',
        'IN_TRANSIT': 'In Transit',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled'
      },
      inputPlaceholder: 'Select status',
      showCancelButton: true
    });

    if (status) {
      try {
        setLoading(true);
        const actor = await getActor();
        const result = await actor.updateShipmentStatus(shipmentId, status);
        // Handle the Message type response
        if ('Success' in result) {
          Swal.fire('Success', result.Success, 'success');
        } else if ('NotFound' in result) {
          Swal.fire('Not Found', result.NotFound, 'error');
        } else if ('Unauthorized' in result) {
          Swal.fire('Unauthorized', result.Unauthorized, 'warning');
        } else {
          Swal.fire('Error', 'Unknown response from canister', 'error');
        }
        await fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to update shipment status', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelShipment = async (shipmentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const actor = await getActor();
        const response = await actor.cancelShipment(shipmentId);
        // Handle the Message type response
        if ('Success' in result) {
          Swal.fire('Cancelled!', response, 'success');
        } else if ('NotFound' in result) {
          Swal.fire('Not Found', result.NotFound, 'error');
        } else if ('Unauthorized' in result) {
          Swal.fire('Unauthorized', result.Unauthorized, 'warning');
        } else {
          Swal.fire('Error', 'Unknown response from canister', 'error');
        }

        await fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to cancel shipment', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateProduct = async (productId) => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Product',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Product Name">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Description"></textarea>',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ];
      }
    });

    if (formValues) {
      try {
        setLoading(true);
        const actor = await getActor();
        const [name, description] = formValues;
        const result = await actor.updateProduct(productId, name, description);
        // Handle the Message type response
        if ('Success' in result) {
          Swal.fire('Success', result.Success, 'success');
        } else if ('NotFound' in result) {
          Swal.fire('Not Found', result.NotFound, 'error');
        } else if ('Unauthorized' in result) {
          Swal.fire('Unauthorized', result.Unauthorized, 'warning');
        } else {
          Swal.fire('Error', 'Unknown response from canister', 'error');
        }
        await fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to update product', 'error');
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Supply Chain Management</h1>
          <div className="d-flex justify-content-between align-items-center">
            {principal && (
              <div className="d-flex align-items-center">
                <Badge bg="secondary" className="me-2">
                  Principal: {principal.toString().substring(0, 10)}...
                </Badge>
              </div>
            )}
            {loggedIn ? (
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="primary" onClick={handleLogin}>
                Login with Internet Identity
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {!loggedIn ? (
        <Alert variant="info" className="text-center">
          Please login with Internet Identity to access the supply chain management system
        </Alert>
      ) : (
        <>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="products">
                      Products ({productCount})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="shipments">
                      Shipments ({shipmentCount})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="products">
                    <div className="d-flex justify-content-between mb-3">
                      <h3>Product List</h3>
                      <Button variant="success" onClick={handleAddProduct}>
                        Add Product
                      </Button>
                    </div>
                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" />
                      </div>
                    ) : products.length === 0 ? (
                      <Alert variant="info">No products found</Alert>
                    ) : (
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {products.map((product) => (
                          <Col key={product.id}>
                            <Card>
                              <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                  {product.manufacturer}
                                </Card.Subtitle>
                                <Card.Text>{product.description}</Card.Text>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleUpdateProduct(product.id)}
                                >
                                  Update
                                </Button>
                              </Card.Body>
                              <Card.Footer>
                                <small className="text-muted">
                                  Created: {new Date(Number(product.timestamp) / 1000000).toLocaleString()}
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="shipments">
                    <div className="d-flex justify-content-between mb-3">
                      <h3>Shipment List</h3>
                      <Button variant="success" onClick={handleAddShipment}>
                        Add Shipment
                      </Button>
                    </div>
                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" />
                      </div>
                    ) : shipments.length === 0 ? (
                      <Alert variant="info">No shipments found</Alert>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Product ID</th>
                              <th>From</th>
                              <th>To</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shipments.map((shipment) => (
                              <tr key={shipment.id}>
                                <td>{shipment.id.substring(0, 8)}...</td>
                                <td>{shipment.productId.substring(0, 8)}...</td>
                                <td>{shipment.from}</td>
                                <td>{shipment.to}</td>
                                <td>
                                  <span className={`badge bg-${shipment.status === 'DELIVERED' ? 'success' :
                                    shipment.status === 'CANCELLED' ? 'danger' :
                                      shipment.status === 'IN_TRANSIT' ? 'warning' : 'info'
                                    }`}>
                                    {shipment.status}
                                  </span>
                                </td>
                                <td>
                                  {new Date(Number(shipment.timestamp) / 1000000).toLocaleDateString()}
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleUpdateShipmentStatus(shipment.id)}
                                    disabled={shipment.status === 'CANCELLED' || shipment.status === 'DELIVERED'}
                                  >
                                    Update Status
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleCancelShipment(shipment.id)}
                                    disabled={shipment.status === 'CANCELLED' || shipment.status === 'DELIVERED'}
                                  >
                                    Cancel
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </>
      )}
    </Container>
  );
}