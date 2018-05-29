import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Colors, Metrics } from '@themes';
import styles from './TabsContentStyles';

class TabsContent extends React.Component {
  state = {
    tabs: [],
    activeIndex: 0,
    contentWidth: 0,
    tabsOffsetX: 0,
    tabClicked: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.activeIndex !== nextState.activeIndex ||
      this.state.tabs.length !== nextState.tabs.length
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contentWidth !== this.state.contentWidth) {
      this.scrollByIndex(this.props.initialIndex, false);
    }

    if (this.state.tabs) {
      const viewedTabs = this.state.tabs.slice(0, this.state.activeIndex);
      const tabsOffsetX = viewedTabs.reduce((prev, cur) => prev + cur.width, 0);

      Animated.parallel([
        Animated.timing(this.underlineOffsetX, {
          toValue: tabsOffsetX || 0,
          duration: 200,
        }),
        Animated.timing(this.underlineWidth, {
          toValue: this.state.tabs[this.state.activeIndex].width,
          duration: 200,
        }),
      ]).start();
    }
  }

  setContentScroll = event => {
    const { layoutMeasurement, contentOffset } = event.nativeEvent;
    this.setState(
      {
        activeIndex: contentOffset.x / layoutMeasurement.width,
        tabClicked: false,
      },
      () => {
        if (this.props.scrollTabsEnabled) {
          const viewedTabs = this.state.tabs.slice(0, this.state.activeIndex);
          const tabsOffsetX = viewedTabs.reduce((prev, cur) => prev + cur.width, 0);

          if ((tabsOffsetX + this.state.tabs[this.state.activeIndex].width) > Metrics.screenWidth) {
            this.tabsScroll.scrollTo({
              x: tabsOffsetX - (Metrics.screenWidth - this.state.tabs[this.state.activeIndex].width) + 32,
              animated: true,
            });
          }

          if (tabsOffsetX + 100 < this.state.tabsOffsetX > tabsOffsetX - 100) {
            this.tabsScroll.scrollTo({
              x: tabsOffsetX,
              animated: true,
            });
          }

        }
      },
    );
  };

  setTabsScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    this.setState({ tabsOffsetX: contentOffset.x });
  };

  underlineOffsetX = new Animated.Value(0);
  underlineWidth = new Animated.Value(0);

  scrollByIndex = (index, animated) => {
    if (index !== this.state.activeIndex && !this.state.tabClicked) {
      this.setState({ activeIndex: index, tabClicked: true }, () => {
        this.contentScroll.scrollTo({
          x: this.state.contentWidth * index,
          animated,
        });
      });
    }
  };

  tabs = [];

  tabLayout = ({ nativeEvent }, index) => {
    this.tabs = [
      ...this.tabs,
      {
        index,
        width: nativeEvent.layout.width,
      },
    ];

    if (this.tabs.length === this.props.tabs.length) {
      const sortedTabs = this.tabs.sort((a, b) => a.index - b.index);
      this.setState({
        tabs: sortedTabs,
      });
    }
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={[styles.tabs, this.props.containerStyles]}
          contentContainerStyle={styles.tabsWrapper}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={this.setTabsScroll}
          ref={el => {
            this.tabsScroll = el;
          }}
        >
          {this.props.tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              activeOpacity={0.9}
              onLayout={e => this.tabLayout(e, tab.index)}
              onPress={() => {
                this.scrollByIndex(index, true);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeIndex !== index && { opacity: 0.7 },
                  { color: this.props.textColor },
                ]}
              >
                {tab.tabtitle}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {
                transform: [{ translateX: this.underlineOffsetX }],
                width: this.underlineWidth,
                backgroundColor: this.props.underlineColor,
              },
            ]}
          />
        </ScrollView>
        <ScrollView
          scrollEnabled={this.props.scrollEnabled}
          style={styles.contents}
          contentContainerStyle={styles.contentsWrapper}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          ref={el => {
            this.contentScroll = el;
          }}
          onMomentumScrollEnd={this.setContentScroll}
          onLayout={event =>
            this.setState({
              contentWidth: event.nativeEvent.layout.width,
            })
          }
        >
          {this.props.tabs.map((tab, index) => (
            <View key={index} style={styles.content}>
              <ScrollView>{tab.content}</ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

TabsContent.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  scrollEnabled: PropTypes.bool,
  initialIndex: PropTypes.number,
  scrollTabsEnabled: PropTypes.bool,
  containerStyles: PropTypes.shape(),
  textColor: PropTypes.string,
  underlineColor: PropTypes.string,
};

TabsContent.defaultProps = {
  initialIndex: 0,
  scrollEnabled: true,
  scrollTabsEnabled: true,
  containerStyles: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey200,
    backgroundColor: Colors.white,
  },
  textColor: Colors.grey900_87,
  underlineColor: Colors.grey900_87,
};

export default TabsContent;
