import React, { Component } from "react";
import { connect } from "react-redux";

import { productActions, cartActions } from "../../redux/actions/index";
import ProductReviewList from "../ProductReviews/ProductReviewList";

import Loader from "../Loader";

class ProductPage extends Component {
    componentDidMount() {
        this.loadProduct();
    }

    loadProduct() {
        const { id } = this.props.match.params;

        this.props.getProduct(id);
    }

    addToCart = () => {
        const { id } = this.props.product.data;
        this.props.addToCart(id);
    };

    _onAddToCart = () => this.addToCart();

    render() {
        const { 
            data: productData,
            isLoaded, 
            fetched, 
        } = this.props.product;
        if (!isLoaded) {
            return <Loader />;
        } else if (!fetched) {
            return <div>Error</div>;
        } else {
            const { current_user, userAuthenticated } = this.props;

            return (
                <div className="container" id="app">
                    <div className="row">
                        <div className="col-md-9">
                            <table className="table table-striped">
                                <tbody>
                                    <tr className="text-center">
                                        <th scope="row" colSpan="2">
                                            <img
                                                style={{ maxHeight: 100 }}
                                                src={productData.image_path}
                                                className="img-responsive"
                                            />
                                            <h4>{productData.name}</h4>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td scope="row">Description</td>
                                        <td>
                                            {productData.short_description}
                                            <br />
                                            <br />
                                            {productData.long_description}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Product Details</td>
                                        <td>{productData.product_details}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="col-md-3">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <h3>{productData.formatted_cost}</h3>
                                    <small>
                                        {productData.shippable ? (
                                            "This item is shippable"
                                        ) : (
                                            <div>
                                                This item is{" "}
                                                <strong>not</strong> shippable
                                            </div>
                                        )}
                                    </small>
                                    <br />
                                    {productData.free_delivery ? (
                                        <small>Free Delivery</small>
                                    ) : (
                                        ""
                                    )}
                                </li>
                                <li className="list-group-item">
                                    {userAuthenticated &&
                                    productData.user_id === current_user.data.id ? (
                                        <div>
                                            {/* href={`/vendor/${current_user.user.company.slug}/products/${product.id}/edit`} */}
                                            <a
                                                href="#"
                                                className="btn btn-warning btn-sm pull-left"
                                            >
                                                Edit item
                                            </a>
                                            {/* href={`/vendor/${current_user.user.company.slug}/products/${product.id}/delete`}  */}
                                            <a
                                                href="#"
                                                className="btn btn-danger btn-sm pull-right"
                                            >
                                                Delete item
                                            </a>
                                        </div>
                                    ) : (
                                        // href={`/products/add`}
                                        <button
                                            href="#"
                                            className="btn btn-primary btn-sm"
                                            onClick={this._onAddToCart}
                                        >
                                            Add to cart
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <ProductReviewList
                                reviews={productData.reviews}
                                score={productData.review}
                                current_user={current_user}
                                userAuthenticated={userAuthenticated}
                                product={productData}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    current_user: state.current_user,
    product: state.product
});
const mapDispatchToProps = dispatch => ({
    addToCart: productID => dispatch(cartActions.addToCart(productID)),
    getProduct: id => dispatch(productActions.getProduct(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
