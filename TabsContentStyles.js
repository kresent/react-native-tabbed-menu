import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '@themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  tabs: {
    flexShrink: 0,
    flexGrow: 0,
    height: 56,
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  tabText: {
    fontFamily: Fonts.type.serif,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
  },
  contents: {
    flexShrink: 1,
    flexGrow: 1,
    backgroundColor: Colors.grey50,
  },
  contentsWrapper: {
    flexDirection: 'row',
  },
  content: {
    width: Metrics.screenWidth,
  },
});

export default styles;
