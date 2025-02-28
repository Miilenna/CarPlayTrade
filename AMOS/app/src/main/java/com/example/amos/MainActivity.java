package com.example.amos;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.example.amos.R;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Botón de menú hamburguesa
        ImageButton menuButton = findViewById(R.id.menu_button);
        menuButton.setOnClickListener(v ->
                Toast.makeText(MainActivity.this, "Menú abierto", Toast.LENGTH_SHORT).show()
        );

        // Botón de búsqueda
        Button searchButton = findViewById(R.id.btn_search);
        searchButton.setOnClickListener(v ->
                Toast.makeText(MainActivity.this, "Buscando...", Toast.LENGTH_SHORT).show()
        );

        // Botón de "Empecemos"
        Button startButton = findViewById(R.id.btn_start);
        startButton.setOnClickListener(v ->
                Toast.makeText(MainActivity.this, "Iniciando venta", Toast.LENGTH_SHORT).show()
        );
    }
}
