import React from 'react';
import { SafeAreaView, StyleSheet, Linking, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const APP = 'https://sankhachthue.pages.dev/';
const HOST = 'sankhachthue.pages.dev';

export default function App() {
  const allow = (req) => {
    try {
      const u = new URL(req.url);
      if (u.host === HOST) return true;
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        Linking.openURL(req.url);
        return false;
      }
    } catch (e) {}
    return true;
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.bar}>
        <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
        <View>
          <Text style={styles.title}>Săn Khách</Text>
          <Text style={styles.sub}>Vinhomes Smart City</Text>
        </View>
      </View>
      <WebView
        source={{ uri: APP }}
        style={styles.web}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        pullToRefreshEnabled
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={allow}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  bar: { height: 54, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e7e9ee' },
  logo: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  logoText: { color: '#fff', fontWeight: '900' },
  title: { color: '#101828', fontSize: 14, fontWeight: '900' },
  sub: { color: '#667085', fontSize: 10, marginTop: 1 },
  web: { flex: 1, backgroundColor: '#f5f6f8' },
});
