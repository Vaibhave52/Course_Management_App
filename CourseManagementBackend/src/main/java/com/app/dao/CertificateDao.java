package com.app.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import com.app.entity.Certificate;

public interface CertificateDao extends JpaRepository<Certificate, Integer> {

}
