import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 10) {
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color(red: 0.067, green: 0.094, blue: 0.153))
                        .frame(width: 34, height: 34)
                    Text("S")
                        .foregroundColor(.white)
                        .font(.system(size: 16, weight: .black))
                }

                VStack(alignment: .leading, spacing: 1) {
                    Text("Săn Khách")
                        .font(.system(size: 15, weight: .black))
                    Text("Vinhomes Smart City · Realtime lead")
                        .font(.system(size: 10.5, weight: .semibold))
                        .foregroundColor(.secondary)
                }

                Spacer()
            }
            .padding(.horizontal, 14)
            .frame(height: 56)
            .background(Color.white)

            Divider()
            LeadWebView(url: URL(string: "https://sankhachthue.pages.dev/")!)
        }
    }
}
