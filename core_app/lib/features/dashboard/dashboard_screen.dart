import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resumo Financeiro'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.pie_chart, size: 64, color: Color(0xFF1976D2)),
            SizedBox(height: 16),
            Text(
              'Bem-vindo ao CoreApp!',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text('Seu dashboard financeiro aparecerá aqui.'),
          ],
        ),
      ),
    );
  }
}
