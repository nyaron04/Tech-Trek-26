package com.techtrek.backend;

import java.lang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.skhanal5.supabase.SupabaseClient;
import com.skhanal5.supabase.models.SelectQuery;

var client = SupabaseClient.newInstance("https://dckzghjwdibseemluukq.supabase.co", "sb_publishable_1oCyXctIYXKl33t954KK6g_kPI_QHPU");

var query = new SelectQuery.SelectQueryBuilder()
	.from("users")
	.select("*")
	.build();

var response = client.executeSelect(query, String.class);
System.out.println(response);


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
