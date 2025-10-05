package com.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Image extends BaseEntity {

    @Lob // Large Object (for binary data)
    @Column(name = "data", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] data;
    
    @ManyToOne
    @JoinColumn(name = "certificate_id")
    private Certificate certificate;

}
