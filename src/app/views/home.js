import React from 'react';
import { Component } from "react";
import { withTranslation } from 'react-i18next';
import { axiosInstance } from '../api/axiosInstance';
import { List, Skeleton, Card } from 'antd';
import { getTranslatedString } from '../i18n/func';
import { Link } from 'react-router-dom';

const { Meta } = Card;

class HomeView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      categories: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    // Load resources
    axiosInstance
      .get('api/categories')
      .then((categories) => {
        if (this._isMounted) this.setState({ loading: false, categories: categories.data })
      })
      .catch(() => { if (this._isMounted) this.setState({ loading: false }) });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.loading) {
      return (
        <>
          <h1>{this.props.t('home')}</h1>
          <Skeleton active />
        </>
      )
    }

    const getCard = (category) => {
      if (category.image_url) {
        let image_url = category.image_url
        if (category.image_url.includes('https://res.cloudinary.com/')) {
          image_url = category.image_url.replace('/upload/', '/upload/ar_1.5,c_crop/')
        } else {
          image_url = category.image_url
        }

        return (
          <Card hoverable cover={<img alt={category.title_en} src={image_url} />}>
            <Meta title={getTranslatedString(category, 'title')} description="" />
          </Card>
        )
      } 

      return (
        <Card hoverable>
          <Meta title={getTranslatedString(category, 'title')} description="" />
        </Card>
      )
    }

    return (
      <>
        <h1>{this.props.t('home')}</h1>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={this.state.categories}
          renderItem={category => (
            <List.Item>
              <Link to={'/categories/' + category.id}>
                {getCard(category)}
              </Link>
            </List.Item>
          )}
          style={{marginTop: 20}}
        />
      </>
    );
  }
}

export default withTranslation()(HomeView)
